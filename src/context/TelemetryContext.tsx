import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

interface TerminalData {
  power: string;
  current: string;
  soc: string;
  bayStatus: string;
  vehicleType: string;
  loadDecision: string;
  throttleLevel: string;
  predictDuration: number; // Added to hold the AI wait time
}

interface TelemetryContextType {
  power: string; voltage: string; current: string; bayStatus: string; soc: string;
  vehicleType: string; throttleLevel: string; loadDecision: string; predictProbability: string; 
  fetchStatus: string;
  terminalsData: Record<number, TerminalData>;
  setPower: (value: string) => void;
  setBayStatus: (value: string) => void;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

const DEVICE_MAP: Record<number, string> = {
  1: "c6e24760-a9bc-11f1-8a27-e1d168a2087d",
  2: "d6c422c0-a9bc-11f1-973e-db7ef6e48014",
  3: "fff1f9b0-a9bc-11f1-b576-77a220d5bf3e",
};

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [power, setPower] = useState('0');
  const [voltage, setVoltage] = useState('0');
  const [current, setCurrent] = useState('0');
  const [bayStatus, setBayStatus] = useState('STANDBY');
  const [soc, setSoc] = useState('0');
  const [vehicleType, setVehicleType] = useState('2');
  const [throttleLevel, setThrottleLevel] = useState('100');
  const [loadDecision, setLoadDecision] = useState('NORMAL');
  const [predictProbability, setPredictProbability] = useState('0');
  const [fetchStatus, setFetchStatus] = useState('Waiting...');

  // State initialized with predictDuration
  const [terminalsData, setTerminalsData] = useState<Record<number, TerminalData>>({
    1: { power: '0', current: '0', soc: '0', bayStatus: 'STANDBY', vehicleType: '1', loadDecision: 'NORMAL', throttleLevel: '100', predictDuration: 0 },
    2: { power: '0', current: '0', soc: '0', bayStatus: 'STANDBY', vehicleType: '2', loadDecision: 'NORMAL', throttleLevel: '100', predictDuration: 0 },
    3: { power: '0', current: '0', soc: '0', bayStatus: 'STANDBY', vehicleType: '3', loadDecision: 'NORMAL', throttleLevel: '100', predictDuration: 0 },
  });

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const loginResponse = await fetch('https://thingsboard.cloud/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'ayushsrivastavaind@gmail.com', password: 'Ayush@0541' })
        });
        
        if (!loginResponse.ok) { setFetchStatus('Auth Error'); return; }
        
        const authData = await loginResponse.json();
        const jwtToken = authData.token;
        
        // FIXED: Added 'predictDuration' to the keys request list
        const keys = "power,voltage,current,bayStatus,initialSoc,vehicleType,throttleLevel,loadDecision,predictProbablity,predictDuration";

        let newData = { ...terminalsData };

        for (const [idStr, deviceId] of Object.entries(DEVICE_MAP)) {
          const id = parseInt(idStr);
          const url = `https://thingsboard.cloud/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?keys=${keys}`;
          const response = await fetch(url, { headers: { 'Accept': 'application/json', 'X-Authorization': `Bearer ${jwtToken}` } });
          
          if (response.ok) {
            const data = await response.json();
            
            newData[id] = {
              power: data.power?.[0]?.value ? String(data.power[0].value) : '0',
              current: data.current?.[0]?.value ? String(data.current[0].value) : '0',
              soc: data.initialSoc?.[0]?.value ? String(data.initialSoc[0].value) : '0',
              bayStatus: data.bayStatus?.[0]?.value ? String(data.bayStatus[0].value) : 'STANDBY',
              vehicleType: data.vehicleType?.[0]?.value ? String(data.vehicleType[0].value) : String(id),
              loadDecision: data.loadDecision?.[0]?.value ? String(data.loadDecision[0].value) : 'NORMAL',
              throttleLevel: data.throttleLevel?.[0]?.value ? String(data.throttleLevel[0].value) : '100',
              // FIXED: Successfully extracts the AI duration
              predictDuration: data.predictDuration?.[0]?.value ? Number(data.predictDuration[0].value) : 0,
            };

            if (id === 2) {
              setPower(newData[2].power);
              setVoltage(data.voltage?.[0]?.value ? String(data.voltage[0].value) : '0');
              setCurrent(newData[2].current);
              setBayStatus(newData[2].bayStatus);
              setSoc(newData[2].soc);
              setVehicleType(newData[2].vehicleType);
              setThrottleLevel(newData[2].throttleLevel);
              setLoadDecision(newData[2].loadDecision);
              setPredictProbability(data.predictProbablity?.[0]?.value ? String(data.predictProbablity[0].value) : '0');
            }
          }
        }

        setTerminalsData(newData);
        setFetchStatus('Connected');
      } catch (error: any) {
        setFetchStatus(`Failed: ${error.message}`);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  const value = useMemo(
    () => ({ power, voltage, current, bayStatus, soc, vehicleType, throttleLevel, loadDecision, predictProbability, fetchStatus, terminalsData, setPower, setBayStatus }),
    [power, voltage, current, bayStatus, soc, vehicleType, throttleLevel, loadDecision, predictProbability, fetchStatus, terminalsData]
  );

  return <TelemetryContext.Provider value={value}>{children}</TelemetryContext.Provider>;
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) throw new Error('useTelemetry must be used within a TelemetryProvider');
  return context;
};