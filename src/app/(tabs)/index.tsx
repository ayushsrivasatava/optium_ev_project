import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Linking, Alert, Platform, Animated } from 'react-native';
import * as Print from 'expo-print';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export default function HomeScreen() {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderMessage, setSenderMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Typing effect state for the terminal line
  const [typedRole, setTypedRole] = useState('');
  const fullText = "Embedded Systems Engineer";
  const [showCursor, setShowCursor] = useState(true);
  
  // ESP32 Connection State & Unlock Switch
  const [isConnecting, setIsConnecting] = useState(false);
  const [isEspConnected, setIsEspConnected] = useState(false);
  const ledAnim = useRef(new Animated.Value(0.3)).current;

  // Chatbot States (Sleeping by default until awakened)
  const [isChatAwake, setIsChatAwake] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { sender: 'bot', text: "👋 Hi! I'm Ayush's AI assistant.\nAsk me anything — my skills, projects, internships, or how to hire me!" },
    { sender: 'bot', text: "Try: \"What are your projects?\" · \"What MCUs do you use?\" · \"How to contact you?\"", isHint: true }
  ]);

  const canvasRef = useRef<any>(null);
  const scrollViewRef = useRef<any>(null);
  const [sectionOffsets, setSectionOffsets] = useState<any>({ about: 0, skills: 0, projects: 0, experience: 0, services: 0, certs: 0, contact: 0 });

  // Animations for Chatbot
  const floatAnim = useRef(new Animated.Value(0)).current;
  const snoozeAnim = useRef(new Animated.Value(0)).current;

  // Typing, Cursor & Animations
  useEffect(() => {
    let index = 0;
    const typeTimer = setInterval(() => {
      setTypedRole(fullText.substring(0, index));
      index++;
      if (index > fullText.length) index = 0;
    }, 150);

    const cursorTimer = setInterval(() => setShowCursor(prev => !prev), 500);

    Animated.loop(
      Animated.sequence([
        Animated.timing(ledAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(ledAnim, { toValue: 0.2, duration: 500, useNativeDriver: true })
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 1500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1500, useNativeDriver: true })
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(snoozeAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(snoozeAnim, { toValue: 0.3, duration: 1200, useNativeDriver: true })
      ])
    ).start();

    return () => {
      clearInterval(typeTimer);
      clearInterval(cursorTimer);
    };
  }, []);

  // Solar System & Shooting Stars Background Canvas
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let animationFrameId: number;
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const handleResize = () => {
          if (canvas && typeof window !== 'undefined') {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
          }
        };
        window.addEventListener('resize', handleResize);

        const stars = Array.from({ length: 150 }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5,
          speedY: Math.random() * 0.2 + 0.05,
          opacity: Math.random() * 0.6 + 0.1
        }));

        const sunX = Math.min(150, width * 0.1); 
        const sunY = height * 0.6;
        const planets = [
          { name: 'C', distance: 120, speed: 0.015, angle: 0, color: '#38bdf8' },
          { name: 'Python', distance: 180, speed: 0.012, angle: 1, color: '#34d399' },
          { name: 'STM32', distance: 240, speed: 0.01, angle: 2, color: '#fb7185' },
          { name: 'KiCad', distance: 300, speed: 0.008, angle: 3, color: '#c084fc' },
          { name: 'Verilog', distance: 360, speed: 0.006, angle: 4, color: '#f97316' }
        ];

        const softSkills = ["Hard Work", "Teamwork", "Problem Solving", "Adaptability", "Leadership"];
        const starColors = ['#00ff41', '#38bdf8', '#fb7185', '#fbbf24', '#c084fc'];
        const shootingStars: any[] = [];

        const render = () => {
          ctx.clearRect(0, 0, width, height);

          stars.forEach(s => {
            s.y += s.speedY;
            if (s.y > height) { s.y = 0; s.x = Math.random() * width; }
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
            ctx.fill();
          });

          const time = Date.now() / 200;
          const sunGlow = 50 + Math.sin(time) * 20;
          ctx.beginPath();
          ctx.arc(sunX, sunY, 45, 0, Math.PI * 2);
          ctx.fillStyle = '#FFD700'; 
          ctx.shadowBlur = sunGlow;
          ctx.shadowColor = '#FF4500'; 
          ctx.fill();
          ctx.shadowBlur = 0;

          planets.forEach(p => {
            ctx.beginPath();
            ctx.arc(sunX, sunY, p.distance, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.stroke();

            p.angle += p.speed;
            const x = sunX + Math.cos(p.angle) * p.distance;
            const y = sunY + Math.sin(p.angle) * p.distance;

            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = p.color;
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.font = '10px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(p.name, x + 12, y + 3);
          });

          if (Math.random() < 0.015) {
            shootingStars.push({
              x: Math.random() * width,
              y: 0,
              speedX: (Math.random() - 0.5) * 5,
              speedY: Math.random() * 5 + 3,
              skill: softSkills[Math.floor(Math.random() * softSkills.length)],
              color: starColors[Math.floor(Math.random() * starColors.length)],
              opacity: 1
            });
          }

          for (let i = shootingStars.length - 1; i >= 0; i--) {
            let star = shootingStars[i];
            star.x += star.speedX;
            star.y += star.speedY;
            star.opacity -= 0.003;

            if (star.opacity <= 0 || star.y > height) {
              shootingStars.splice(i, 1);
              continue;
            }

            ctx.save();
            ctx.globalAlpha = star.opacity;
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star.x - star.speedX * 15, star.y - star.speedY * 15);
            ctx.strokeStyle = star.color;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 12;
            ctx.shadowColor = star.color;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = '11px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(star.skill, star.x + 10, star.y + 10);
            ctx.restore();
          }

          animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
          window.removeEventListener('resize', handleResize);
          cancelAnimationFrame(animationFrameId);
        };
      }
    }
  }, []);

  const handleConnectEsp32 = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsEspConnected(true);
      setTimeout(() => {
        scrollToSection('about');
      }, 300);
    }, 1800);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      let botReply = "That's a great question! Check out Ayush's projects or message him directly.";
      const query = userText.toLowerCase();

      if (query.includes('project') || query.includes('work')) {
        botReply = "Ayush built an ADAS EV Dashboard, the Optim-EV Load Management System (https://optim-ev.onrender.com/), and a Transformerless PCB.";
      } else if (query.includes('gate') || query.includes('score')) {
        botReply = "Ayush qualified the GATE 2026 exam in his 3rd year with a score of 460.";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  const scrollToSection = (section: string) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: sectionOffsets[section], animated: true });
    }
  };

  const handleLayout = (section: string) => (event: any) => {
    const layout = event.nativeEvent.layout;
    setSectionOffsets((prev: any) => ({ ...prev, [section]: layout.y - 80 }));
  };

  const generateAndDownloadPdf = async () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html><body><h1>Ayush Srivastava</h1><h3>B.Tech - ECE</h3></body></html>
    `;
    try { await Print.printAsync({ html: htmlContent }); } catch (error) { console.error(error); }
  };

  return (
    <View style={styles.mainContainer}>
      {Platform.OS === 'web' && (
        <canvas ref={canvasRef} style={styles.canvasBackground as any} />
      )}

      {/* TOP NAVIGATION BAR */}
      <View style={styles.navBar}>
        <Text style={styles.navLogo}>~/ayush-srivastava</Text>
        <View style={styles.navLinks}>
          <TouchableOpacity onPress={() => scrollToSection('about')}><Text style={styles.navLinkText}>ABOUT</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => scrollToSection('skills')}><Text style={styles.navLinkText}>SKILLS</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => scrollToSection('projects')}><Text style={styles.navLinkText}>PROJECTS</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => scrollToSection('experience')}><Text style={styles.navLinkText}>EXPERIENCE</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => scrollToSection('certs')}><Text style={styles.navLinkText}>CERTS</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => scrollToSection('contact')}><Text style={styles.navLinkText}>CONTACT</Text></TouchableOpacity>
        </View>
        <View style={styles.navRight}>
          <View style={styles.hireBadge}>
            <View style={[styles.hireDot, { backgroundColor: isEspConnected ? '#00ff41' : '#00ff41' }]} />
            <Text style={styles.hireText}>Available for hire</Text>
          </View>
        </View>
      </View>

      <ScrollView ref={scrollViewRef} style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        
        {/* HERO SECTION WITH SPLIT LAYOUT */}
        <View style={styles.heroSection}>
          <View style={styles.heroLayoutRow}>
            
            {/* Left Column: Title & Intro (Matched exactly to reference image) */}
            <View style={styles.heroContentLeft}>
              <View style={styles.subHeaderRow}>
                <View style={styles.subHeaderLine} />
                <Text style={styles.subHeaderText}>EMBEDDED SYSTEMS · IOT · FIRMWARE ENGINEERING</Text>
              </View>

              <View style={styles.mainTitleRow}>
                <Text style={styles.titleWhite}>Ayush </Text>
                <Text style={styles.titleGreen}>Srivastava</Text>
              </View>

              <Text style={styles.typingText}>// {typedRole}{showCursor ? '|' : ' '}</Text>

              <Text style={styles.heroDescription}>
                Building <Text style={styles.descHighlight}>reliable, efficient firmware</Text> and connected hardware
                systems — from bare-metal microcontrollers to cloud-integrated IoT
                platforms. Connect your ESP32 hardware gateway on the right to unlock full portfolio access.
              </Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.btnSolid} onPress={() => scrollToSection('projects')}>
                  <MaterialCommunityIcons name="lightning-bolt" size={16} color="#050811" />
                  <Text style={styles.btnSolidText}>VIEW PROJECTS</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.btnOutline} onPress={generateAndDownloadPdf}>
                  <MaterialCommunityIcons name="arrow-down" size={16} color="#00ff41" />
                  <Text style={styles.btnOutlineText}>RESUME</Text>
                </TouchableOpacity>

                <View style={styles.socialIconsRow}>
                  <TouchableOpacity onPress={() => Linking.openURL('https://linkedin.com/in/ayush-srivastava-382030269')} style={styles.iconWrapper}>
                    <MaterialCommunityIcons name="linkedin" size={22} color="#9ca3af" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com')} style={styles.iconWrapper}>
                    <MaterialCommunityIcons name="twitter" size={22} color="#9ca3af" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Linking.openURL('https://github.com/ayushsrivasatava')} style={styles.iconWrapper}>
                    <MaterialCommunityIcons name="github" size={22} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>2+</Text>
                  <Text style={styles.statLabel}>YEARS EXP.</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>5+</Text>
                  <Text style={styles.statLabel}>PROJECTS BUILT</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>5+</Text>
                  <Text style={styles.statLabel}>MCU FAMILIES</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>3+</Text>
                  <Text style={styles.statLabel}>IOT PROTOCOLS</Text>
                </View>
              </View>

            </View>

            {/* Right Column: ESP32 Hardware Gateway Module */}
            <View style={styles.heroContentRight}>
              <View style={styles.espModuleBox}>
                <View style={styles.espHeader}>
                  <FontAwesome5 name="microchip" size={16} color="#00ff41" />
                  <Text style={styles.espTitle}>ESP32 HARDWARE GATEWAY</Text>
                  <Animated.View style={[styles.espLed, { opacity: ledAnim, backgroundColor: isEspConnected ? '#00ff41' : (isConnecting ? '#38bdf8' : '#ef4444') }]} />
                </View>
                <View style={styles.espBody}>
                  <View style={styles.espChipDesign}>
                    <View style={styles.espAntenna}><MaterialCommunityIcons name="wifi" size={22} color="#9ca3af" /></View>
                    <Text style={styles.espCoreText}>{isEspConnected ? 'ONLINE' : (isConnecting ? 'SYNCING' : 'STANDBY')}</Text>
                    <Text style={styles.espCoreSub}>{isEspConnected ? 'UART Handshake Verified' : 'Awaiting Device Signal'}</Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.espConnectBtn, isEspConnected && { backgroundColor: '#10b981' }]} 
                    onPress={handleConnectEsp32} 
                    disabled={isConnecting || isEspConnected}
                  >
                    <MaterialCommunityIcons name={isEspConnected ? "check-decagram" : (isConnecting ? "lan-connect" : "power")} size={16} color="#050a08" />
                    <Text style={styles.espConnectBtnText}>
                      {isEspConnected ? 'ESP32 LINK ACTIVE ✓' : (isConnecting ? 'ESTABLISHING HANDSHAKE...' : 'CONNECT ESP32 DEVICE')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

          </View>
        </View>

        {/* --- ALL PORTFOLIO SECTIONS WRAPPED WITH BLUR/LOCK EFFECT WHEN ESP32 IS DISCONNECTED --- */}
        <View style={styles.portfolioSectionsWrapper}>
          
          <View style={[styles.blurOverlayContainer, !isEspConnected && styles.blurredBlock]}>
            {!isEspConnected && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                zIndex: 20,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(3, 7, 5, 0.6)'
              }}>
                <div style={{
                  textAlign: 'center',
                  border: '2px solid #00ff41',
                  padding: '30px 40px',
                  borderRadius: '12px',
                  backgroundColor: '#050a08',
                  boxShadow: '0 0 30px rgba(0, 255, 65, 0.2)'
                }}>
                  <span style={{ fontSize: '32px' }}>🔒</span>
                  <h3 style={{ color: '#00ff41', fontFamily: 'monospace', margin: '15px 0 8px 0', fontSize: '18px' }}>HARDWARE ACCESS RESTRICTED</h3>
                  <p style={{ color: '#9ca3af', fontFamily: 'monospace', fontSize: '13px', margin: 0 }}>Please connect the ESP32 node above to unlock portfolio content.</p>
                </div>
              </div>
            )}

            {/* --- ABOUT ME SECTION --- */}
            <View onLayout={handleLayout('about')} style={styles.sectionBlock}>
              <Text style={styles.sectionHeading}>About Me</Text>
              <View style={styles.aboutGrid}>
                <View style={styles.aboutTextCol}>
                  <Text style={styles.aboutP}>
                    I am <Text style={styles.textWhiteBold}>Ayush Srivastava</Text>, an ECE Engineering student pursuing B.Tech at <Text style={styles.textWhiteBold}>MMMUT, Gorakhpur</Text>. I build intelligent connected hardware — from bare-metal firmware to cloud-integrated IoT platforms.
                  </Text>
                  <Text style={styles.aboutP}>
                    With hands-on experience in microcontroller ecosystems, PCB design, and machine learning applications, and training at <Text style={styles.textWhiteBold}>Emertxe Information Technologies</Text> and <Text style={styles.textWhiteBold}>North Eastern Railways</Text>, I am actively seeking opportunities in embedded systems and firmware engineering.
                  </Text>
                </View>
              </View>
            </View>

            {/* --- WHAT I CAN DO FOR YOU (SERVICES) --- */}
            <View onLayout={handleLayout('services')} style={styles.sectionBlock}>
              <Text style={styles.sectionHeading}>What I Can Do For You</Text>
              <View style={styles.servicesGrid}>
                <View style={styles.serviceCard}>
                  <FontAwesome5 name="bolt" size={20} color="#fb923c" style={{marginBottom: 16}} />
                  <Text style={styles.serviceTitle}>Firmware Development</Text>
                  <Text style={styles.serviceDesc}>Bare-metal and RTOS-based firmware for microcontrollers including ESP32, STM32, and Arduino. Clean, efficient, and well-documented code.</Text>
                </View>
                <View style={styles.serviceCard}>
                  <FontAwesome5 name="satellite-dish" size={20} color="#38bdf8" style={{marginBottom: 16}} />
                  <Text style={styles.serviceTitle}>IoT System Design</Text>
                  <Text style={styles.serviceDesc}>End-to-end IoT solutions — sensor integration, wireless communication, and hardware architecture.</Text>
                </View>
                <View style={styles.serviceCard}>
                  <FontAwesome5 name="microchip" size={20} color="#fb7185" style={{marginBottom: 16}} />
                  <Text style={styles.serviceTitle}>PCB & Hardware Design</Text>
                  <Text style={styles.serviceDesc}>Schematic capture and PCB layout using KiCad. Component selection and circuit simulation in LTSpice.</Text>
                </View>
              </View>
            </View>

            {/* --- TECHNICAL SKILLS SECTION --- */}
            <View onLayout={handleLayout('skills')} style={styles.sectionBlock}>
              <Text style={styles.sectionHeading}>Technical Skills</Text>
              <View style={styles.skillsGrid}>
                
                <View style={styles.skillCard}>
                  <View style={styles.skillCardHeader}>
                    <FontAwesome5 name="bolt" size={16} color="#fb923c" />
                    <Text style={styles.skillPercentage}>90%</Text>
                  </View>
                  <Text style={styles.skillCategory}>HARDWARE</Text>
                  <Text style={styles.skillTitle}>Microcontrollers</Text>
                  <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '90%' }]} /></View>
                  <View style={styles.pillContainer}>
                    <Text style={styles.pill}>ESP32 / ESP8266</Text><Text style={styles.pill}>STM32</Text><Text style={styles.pill}>ARM Cortex-M</Text>
                  </View>
                </View>

                <View style={styles.skillCard}>
                  <View style={styles.skillCardHeader}>
                    <FontAwesome5 name="wrench" size={16} color="#9ca3af" />
                    <Text style={styles.skillPercentage}>88%</Text>
                  </View>
                  <Text style={styles.skillCategory}>FIRMWARE</Text>
                  <Text style={styles.skillTitle}>Low-Level Dev</Text>
                  <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '88%' }]} /></View>
                  <View style={styles.pillContainer}>
                    <Text style={styles.pill}>C / C++</Text><Text style={styles.pill}>Python</Text><Text style={styles.pill}>FreeRTOS</Text><Text style={styles.pill}>Bare Metal</Text>
                  </View>
                </View>

                <View style={styles.skillCard}>
                  <View style={styles.skillCardHeader}>
                    <FontAwesome5 name="microchip" size={16} color="#a78bfa" />
                    <Text style={styles.skillPercentage}>80%</Text>
                  </View>
                  <Text style={styles.skillCategory}>INTERFACES</Text>
                  <Text style={styles.skillTitle}>Communication Buses</Text>
                  <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '80%' }]} /></View>
                  <View style={styles.pillContainer}>
                    <Text style={styles.pill}>UART</Text><Text style={styles.pill}>SPI</Text><Text style={styles.pill}>I2C</Text><Text style={styles.pill}>CAN</Text>
                  </View>
                </View>

                <View style={styles.skillCard}>
                  <View style={styles.skillCardHeader}>
                    <FontAwesome5 name="microscope" size={16} color="#60a5fa" />
                    <Text style={styles.skillPercentage}>85%</Text>
                  </View>
                  <Text style={styles.skillCategory}>TOOLING & DEBUG</Text>
                  <Text style={styles.skillTitle}>Hardware Tools</Text>
                  <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '85%' }]} /></View>
                  <View style={styles.pillContainer}>
                    <Text style={styles.pill}>KiCad</Text><Text style={styles.pill}>LTSpice</Text><Text style={styles.pill}>ANSYS</Text><Text style={styles.pill}>STM32IDE</Text>
                  </View>
                </View>

              </View>
            </View>

            {/* --- PROJECTS SECTION --- */}
            <View onLayout={handleLayout('projects')} style={styles.sectionBlock}>
              <Text style={styles.sectionHeading}>Projects</Text>
              <View style={styles.tabsRow}>
                <View style={styles.tabActive}><Text style={styles.tabTextActive}>ALL</Text></View>
                <View style={styles.tabInactive}><Text style={styles.tabTextInactive}>ESP32 & IOT</Text></View>
                <View style={styles.tabInactive}><Text style={styles.tabTextInactive}>STM32</Text></View>
                <View style={styles.tabInactive}><Text style={styles.tabTextInactive}>PCB DESIGN</Text></View>
              </View>

              <View style={styles.projectsGrid}>
                
                <View style={styles.projectCard}>
                  <View style={styles.projectTopRow}>
                    <Text style={styles.projectStatus}>● LIVE DEPLOYMENT</Text>
                    <View style={styles.featuredBadge}><Text style={styles.featuredText}>FEATURED</Text></View>
                  </View>
                  <Text style={styles.projectTitle}>⚡ Optim-EV Load Management</Text>
                  <Text style={styles.projectDesc}>Smart load management system for EV charging, utilizing ESP32 to balance grid distribution and monitor real-time consumption data.</Text>
                  <View style={styles.pillContainer}>
                    <Text style={styles.pill}>ESP32</Text><Text style={styles.pill}>FreeRTOS</Text><Text style={styles.pill}>WebSockets</Text><Text style={styles.pill}>Node.js</Text>
                  </View>
                  <View style={styles.projectLinks}>
                    <TouchableOpacity onPress={() => Linking.openURL('https://github.com/ayushsrivasatava')}><Text style={styles.projectLinkText}>→ GITHUB</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL('https://optim-ev.onrender.com/')}><Text style={styles.projectLinkText}>↻ LIVE SERVER</Text></TouchableOpacity>
                  </View>
                </View>

                <View style={styles.projectCard}>
                  <View style={styles.projectTopRow}>
                    <Text style={styles.projectStatus}>● COMPLETED · 2026</Text>
                  </View>
                  <Text style={styles.projectTitle}>🚗 ADAS & EV Monitoring Dashboard</Text>
                  <Text style={styles.projectDesc}>Developed advanced driver-assistance systems and Electric Vehicle application prototypes using ARM Cortex-M3.</Text>
                  <View style={styles.pillContainer}>
                    <Text style={styles.pill}>STM32</Text><Text style={styles.pill}>Embedded C</Text><Text style={styles.pill}>UART</Text><Text style={styles.pill}>Sensors</Text>
                  </View>
                  <View style={styles.projectLinks}>
                    <TouchableOpacity onPress={() => Linking.openURL('https://github.com/ayushsrivasatava')}><Text style={styles.projectLinkText}>→ GITHUB</Text></TouchableOpacity>
                  </View>
                </View>

                <View style={styles.projectCard}>
                  <View style={styles.projectTopRow}>
                    <Text style={styles.projectStatus}>● COMPLETED · 2026</Text>
                  </View>
                  <Text style={styles.projectTitle}>🥛 ML Milk Adulteration Detection</Text>
                  <Text style={styles.projectDesc}>Machine Learning assisted milk adulteration detection utilizing Microwave Microstrip Antennas and simulation tools.</Text>
                  <View style={styles.pillContainer}>
                    <Text style={styles.pill}>ANSYS</Text><Text style={styles.pill}>Python</Text><Text style={styles.pill}>Scikit</Text><Text style={styles.pill}>Pandas</Text>
                  </View>
                  <View style={styles.projectLinks}>
                    <TouchableOpacity onPress={() => Linking.openURL('https://github.com/ayushsrivasatava')}><Text style={styles.projectLinkText}>→ GITHUB</Text></TouchableOpacity>
                  </View>
                </View>

                <View style={styles.projectCard}>
                  <View style={styles.projectTopRow}>
                    <Text style={styles.projectStatus}>● PROTOTYPE · 2025</Text>
                  </View>
                  <Text style={styles.projectTitle}>🔌 Transformerless Power Supply</Text>
                  <Text style={styles.projectDesc}>Designed and simulated a transformerless power supply PCB tailored for low-power edge IoT devices.</Text>
                  <View style={styles.pillContainer}>
                    <Text style={styles.pill}>KiCad</Text><Text style={styles.pill}>LTSpice</Text><Text style={styles.pill}>PCB Design</Text>
                  </View>
                  <View style={styles.projectLinks}>
                    <TouchableOpacity onPress={() => Linking.openURL('https://github.com/ayushsrivasatava')}><Text style={styles.projectLinkText}>→ GITHUB</Text></TouchableOpacity>
                  </View>
                </View>

              </View>
            </View>

            {/* --- EXPERIENCE & EDUCATION SECTION --- */}
            <View onLayout={handleLayout('experience')} style={styles.sectionBlock}>
              <Text style={styles.sectionHeading}>Experience & Education</Text>
              <View style={styles.timelineContainer}>
                
                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <Text style={styles.timelineDate}>JUNE 2026</Text>
                  <View style={styles.timelineHeaderRow}>
                    <Text style={styles.timelineTitle}>Trainee</Text>
                    <View style={styles.completedBadge}><Text style={styles.completedText}>✓ COMPLETED</Text></View>
                  </View>
                  <Text style={styles.timelineCompany}>🏢 Emertxe Information Technologies · Remote</Text>
                  <Text style={styles.timelineDesc}>Developed ADAS and Electric Vehicle (EV) application prototypes using STM32 Blue Pill. Implemented Embedded C programs involving UART communication and peripheral interfacing.</Text>
                  <View style={styles.pillContainer}>
                    <Text style={styles.pill}>Embedded C</Text><Text style={styles.pill}>STM32</Text><Text style={styles.pill}>UART</Text>
                  </View>
                </View>

                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <Text style={styles.timelineDate}>2026</Text>
                  <View style={styles.timelineHeaderRow}>
                    <Text style={styles.timelineTitle}>Trainee - Signal and Telecom</Text>
                    <View style={styles.completedBadge}><Text style={styles.completedText}>✓ COMPLETED</Text></View>
                  </View>
                  <Text style={styles.timelineCompany}>🚆 North Eastern Railways · Gorakhpur</Text>
                  <Text style={styles.timelineDesc}>Observed railway signaling and telecommunication systems including interlocking and track circuits.</Text>
                </View>

                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <Text style={styles.timelineDate}>2023 — 2027</Text>
                  <View style={styles.timelineHeaderRow}>
                    <Text style={styles.timelineTitle}>B.Tech in Electronics and Communication</Text>
                  </View>
                  <Text style={styles.timelineCompany}>🎓 Madan Mohan Malaviya University of Technology · Gorakhpur</Text>
                  <Text style={styles.timelineDesc}>Current CGPA: 8.52. Qualified GATE 2026 in 3rd Year with score 460.</Text>
                  <View style={styles.pillContainer}>
                    <Text style={styles.pill}>GATE 2026</Text><Text style={styles.pill}>CGPA 8.52</Text>
                  </View>
                </View>

              </View>
            </View>

            {/* --- CERTIFICATIONS & TRAINING --- */}
            <View onLayout={handleLayout('certs')} style={styles.sectionBlock}>
              <Text style={styles.sectionHeading}>Certifications & Training</Text>
              <View style={styles.certsGrid}>
                <View style={styles.certCard}>
                  <View style={styles.certIconBox}><Text style={{fontSize: 20}}>⚙️</Text></View>
                  <View style={styles.certContent}>
                    <View style={styles.certTopRow}>
                      <Text style={styles.certIssuer}>MATHWORKS</Text>
                      <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>VERIFIED</Text></View>
                    </View>
                    <Text style={styles.certTitle}>Simulink Certification</Text>
                  </View>
                </View>

                <View style={styles.certCard}>
                  <View style={styles.certIconBox}><Text style={{fontSize: 20}}>🖧</Text></View>
                  <View style={styles.certContent}>
                    <View style={styles.certTopRow}>
                      <Text style={styles.certIssuer}>ALTIUM</Text>
                      <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>VERIFIED</Text></View>
                    </View>
                    <Text style={styles.certTitle}>PCB Design Certification</Text>
                  </View>
                </View>

                <View style={styles.certCard}>
                  <View style={styles.certIconBox}><Text style={{fontSize: 20}}>🔬</Text></View>
                  <View style={styles.certContent}>
                    <View style={styles.certTopRow}>
                      <Text style={styles.certIssuer}>TRAINING</Text>
                      <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>VERIFIED</Text></View>
                    </View>
                    <Text style={styles.certTitle}>VLSI Design & Simulation</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* --- MESSAGE ME (CONTACT) --- */}
            <View onLayout={handleLayout('contact')} style={styles.sectionBlock}>
              <Text style={styles.sectionHeading}>Message Me</Text>
              <View style={styles.contactGrid}>
                <View style={styles.contactLeft}>
                  <Text style={styles.contactIntro}>
                    Have a project in mind, a collaboration idea, or just want to say hello? Fill in the form and I will get back to you as soon as possible.
                  </Text>
                  <View style={styles.contactInfoRow}>
                    <View style={styles.contactIcon}><MaterialCommunityIcons name="email" size={16} color="#00ff41" /></View>
                    <Text style={styles.contactInfoText}>ayushsrivastavaind@email.com</Text>
                  </View>
                  <View style={styles.contactInfoRow}>
                    <View style={styles.contactIcon}><MaterialCommunityIcons name="map-marker" size={16} color="#fb7185" /></View>
                    <Text style={styles.contactInfoText}>Gorakhpur, UP, India</Text>
                    <View style={[styles.hireDot, {marginLeft: 'auto', backgroundColor: '#00ff41'}]} />
                  </View>
                  <View style={styles.contactInfoRow}>
                    <View style={styles.contactIcon}><MaterialCommunityIcons name="lightning-bolt" size={16} color="#fbbf24" /></View>
                    <Text style={styles.contactInfoText}>Usually responds within 24 hours</Text>
                  </View>
                </View>

                <View style={styles.contactForm}>
                  <Text style={styles.formLabel}>YOUR NAME</Text>
                  <TextInput style={styles.formInput} placeholder="John Doe" placeholderTextColor="#64748b" value={senderName} onChangeText={setSenderName} />
                  
                  <Text style={styles.formLabel}>EMAIL ADDRESS</Text>
                  <TextInput style={styles.formInput} placeholder="john@example.com" placeholderTextColor="#64748b" keyboardType="email-address" value={senderEmail} onChangeText={setSenderEmail} />
                  
                  <Text style={styles.formLabel}>MESSAGE</Text>
                  <TextInput style={[styles.formInput, styles.formTextArea]} placeholder="Tell me about your project or opportunity..." placeholderTextColor="#64748b" multiline numberOfLines={4} value={senderMessage} onChangeText={setSenderMessage} />
                  
                  <TouchableOpacity style={styles.formSubmitBtn} onPress={async () => {
                    if (!senderName || !senderEmail || !senderMessage) return Alert.alert('Error', 'Fill all fields.');
                    setIsSubmitting(true);
                    try {
                      const res = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ access_key: 'd5a08bad-27c3-4ed9-9921-a32a6bb0faa9', name: senderName, email: senderEmail, message: senderMessage })
                      });
                      if ((await res.json()).success) {
                        Alert.alert('Success', 'Message sent!');
                        setSenderName(''); setSenderEmail(''); setSenderMessage('');
                      }
                    } catch { Linking.openURL(`mailto:ayushsrivastavaind@gmail.com`); }
                    setIsSubmitting(false);
                  }}>
                    <MaterialCommunityIcons name="lightning-bolt" size={16} color="#050811" />
                    <Text style={styles.formSubmitText}>{isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={{height: 100}} />
          </View>

        </View>

      </ScrollView>

      {/* FLOATING CHATBOT WIDGET (Snoozing by default, with sleep/awake button animation) */}
      {isChatAwake && isChatOpen ? (
        <View style={styles.chatbotContainer}>
          <View style={styles.chatHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <View style={styles.chatDotsRow}>
                 <View style={[styles.termDot, {backgroundColor: '#ff5f56'}]} />
                 <View style={[styles.termDot, {backgroundColor: '#ffbd2e'}]} />
                 <View style={[styles.termDot, {backgroundColor: '#27c93f'}]} />
               </View>
               <Text style={styles.chatTitle}>Ask AI — About Ayush</Text>
            </View>
            <TouchableOpacity onPress={() => setIsChatOpen(false)}>
              <MaterialCommunityIcons name="close" size={16} color="#4b5563" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.chatMessageArea}>
            {messages.map((m, i) => (
              <View key={i} style={[styles.chatBubble, m.isHint ? styles.chatHint : null]}>
                <Text style={styles.chatText}>{m.text}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.chatInputContainer}>
            <TextInput
              style={[styles.chatInput, Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}]}
              placeholder="Type a message..."
              placeholderTextColor="#4b5563"
              value={chatInput}
              onChangeText={setChatInput}
              onSubmitEditing={handleChatSend}
            />
            <TouchableOpacity style={styles.chatSendBtn} onPress={handleChatSend}>
              <Text style={styles.chatSendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {/* Chatbot Sleep/Awake Floating Trigger */}
      <Animated.View style={[styles.chatOpenFloatButtonContainer, { transform: [{ translateY: floatAnim }] }]}>
        <TouchableOpacity 
          style={[styles.chatToggleButton, isChatAwake && { backgroundColor: '#10b981', borderColor: '#10b981' }]} 
          onPress={() => {
            if (!isChatAwake) {
              setIsChatAwake(true);
              setIsChatOpen(true);
            } else {
              setIsChatAwake(false);
              setIsChatOpen(false);
            }
          }}
        >
          {!isChatAwake && <Animated.Text style={[styles.snoozeZzz, { opacity: snoozeAnim }]}>💤</Animated.Text>}
          <MaterialCommunityIcons name={isChatAwake ? "robot" : "robot-dead"} size={26} color={isChatAwake ? "#050811" : "#00ff41"} />
        </TouchableOpacity>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#030705', position: 'relative' },
  canvasBackground: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 },
  
  // NAVBAR
  navBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 60, backgroundColor: 'rgba(3, 7, 5, 0.85)', borderBottomWidth: 1, borderBottomColor: '#0a170f', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 30, zIndex: 50 },
  navLogo: { color: '#00ff41', fontSize: 14, fontFamily: 'monospace', fontWeight: 'bold' },
  navLinks: { flexDirection: 'row', gap: 24, display: Platform.OS === 'web' && window.innerWidth < 800 ? 'none' : 'flex' },
  navLinkText: { color: '#e5e7eb', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  hireBadge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#00ff41', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  hireDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  hireText: { color: '#00ff41', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },

  scrollArea: { flex: 1, zIndex: 10 },

  // HERO SECTION WITH SPLIT LAYOUT
  heroSection: { minHeight: Platform.OS === 'web' ? ('100vh' as any) : 800, width: '100%', justifyContent: 'center', paddingHorizontal: '8%', paddingTop: 60 },
  heroLayoutRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 40 },
  heroContentLeft: { flex: 1, minWidth: 320, maxWidth: 650 },
  heroContentRight: { width: 420, minWidth: 320, alignItems: 'center' } as any,
  
  subHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  subHeaderLine: { width: 40, height: 1, backgroundColor: '#00ff41', marginRight: 15 },
  subHeaderText: { color: '#00ff41', fontSize: 11, letterSpacing: 2, fontWeight: 'bold' },
  
  mainTitleRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  titleWhite: { fontSize: 72, fontWeight: '900', color: '#ffffff', letterSpacing: -1, lineHeight: 80 },
  titleGreen: { fontSize: 72, fontWeight: '900', color: '#00ff41', letterSpacing: -1, lineHeight: 80, textShadowColor: 'rgba(0, 255, 65, 0.4)', textShadowRadius: 15 },
  
  typingText: { color: '#00ff41', fontSize: 16, fontFamily: 'monospace', marginBottom: 30 },
  
  heroDescription: { color: '#9ca3af', fontSize: 16, lineHeight: 26, marginBottom: 30, maxWidth: 500 },
  descHighlight: { color: '#ffffff', fontWeight: 'bold' },

  buttonRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  btnSolid: { backgroundColor: '#00ff41', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 4, gap: 8 },
  btnSolidText: { color: '#030705', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  btnOutline: { backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 4, borderWidth: 1, borderColor: '#00ff41', gap: 8 },
  btnOutlineText: { color: '#00ff41', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  
  socialIconsRow: { flexDirection: 'row', gap: 12, marginLeft: 10 },
  iconWrapper: { padding: 8, borderWidth: 1, borderColor: '#1e293b', borderRadius: 4 },

  // STATS ROW IN HERO
  statsRow: { flexDirection: 'row', gap: 40, marginTop: 40, borderTopWidth: 1, borderTopColor: '#1e293b', paddingTop: 24, flexWrap: 'wrap' },
  statItem: { alignItems: 'flex-start' },
  statNumber: { color: '#00ff41', fontSize: 32, fontWeight: '900', marginBottom: 4 },
  statLabel: { color: '#4b5563', fontSize: 10, letterSpacing: 1.5, fontWeight: 'bold' },

  // ESP32 GATEWAY MODULE IN RIGHT HERO
  espModuleBox: { width: '100%', maxWidth: 420, backgroundColor: '#050a08', borderWidth: 1, borderColor: '#00ff41', borderRadius: 8, overflow: 'hidden', shadowColor: '#00ff41', shadowOpacity: 0.2, shadowRadius: 15 },
  espHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#0a170f', backgroundColor: '#030705' },
  espTitle: { color: '#00ff41', fontSize: 11, fontFamily: 'monospace', marginLeft: 8, fontWeight: 'bold' },
  espLed: { width: 8, height: 8, borderRadius: 4, marginLeft: 'auto' },
  espBody: { padding: 20, alignItems: 'center' },
  espChipDesign: { width: 140, height: 150, backgroundColor: '#1f2937', borderRadius: 8, borderWidth: 2, borderColor: '#374151', alignItems: 'center', marginBottom: 20, position: 'relative', overflow: 'hidden' },
  espAntenna: { width: '100%', height: 35, backgroundColor: '#111827', borderBottomWidth: 2, borderBottomColor: '#374151', alignItems: 'center', justifyContent: 'center' },
  espCoreText: { color: '#e5e7eb', fontSize: 20, fontWeight: '900', marginTop: 20, letterSpacing: 2 },
  espCoreSub: { color: '#9ca3af', fontSize: 9, fontFamily: 'monospace', marginTop: 4, textAlign: 'center', paddingHorizontal: 4 },
  espConnectBtn: { backgroundColor: '#00ff41', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 4, alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center' },
  espConnectBtnText: { color: '#030705', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },

  portfolioSectionsWrapper: { position: 'relative', width: '100%' },
  blurOverlayContainer: { position: 'relative', width: '100%' },
  blurredBlock: { pointerEvents: 'none', userSelect: 'none' },

  // DETAILED SECTIONS
  sectionBlock: { paddingHorizontal: '10%', paddingTop: 80, maxWidth: 1400, alignSelf: 'center', width: '100%' },
  sectionHeading: { fontSize: 36, fontWeight: 'bold', color: '#ffffff', marginBottom: 40, letterSpacing: -0.5 },

  // About Me
  aboutGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 40, justifyContent: 'space-between' },
  aboutTextCol: { flex: 1, minWidth: 300, maxWidth: 900 },
  aboutP: { color: '#f3f4f6', fontSize: 15, lineHeight: 26, marginBottom: 20 },
  textWhiteBold: { color: '#ffffff', fontWeight: 'bold' },

  // Services
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  serviceCard: { flex: 1, minWidth: 250, backgroundColor: '#050a08', borderWidth: 1, borderColor: '#0a170f', borderRadius: 8, padding: 24 },
  serviceTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  serviceDesc: { color: '#e5e7eb', fontSize: 14, lineHeight: 22 },

  // Skills
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  skillCard: { flex: 1, minWidth: 300, backgroundColor: '#050a08', borderWidth: 1, borderColor: '#0a170f', borderRadius: 8, padding: 24 },
  skillCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  skillPercentage: { color: '#00ff41', fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace' },
  skillCategory: { color: '#00ff41', fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 8 },
  skillTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  progressBarBg: { height: 2, backgroundColor: '#0a170f', width: '100%', marginBottom: 20 },
  progressBarFill: { height: '100%', backgroundColor: '#00ff41' },
  pillContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { borderWidth: 1, borderColor: '#1f2937', color: '#e5e7eb', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, fontSize: 11, fontFamily: 'monospace' },

  // Projects
  tabsRow: { flexDirection: 'row', gap: 10, marginBottom: 30, flexWrap: 'wrap' },
  tabActive: { backgroundColor: '#00ff41', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4 },
  tabTextActive: { color: '#030705', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  tabInactive: { backgroundColor: 'transparent', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4, borderWidth: 1, borderColor: '#0a170f' },
  tabTextInactive: { color: '#e5e7eb', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  projectsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  projectCard: { flex: 1, minWidth: 350, backgroundColor: '#050a08', borderWidth: 1, borderColor: '#0a170f', borderRadius: 8, padding: 24 },
  projectTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  projectStatus: { color: '#00ff41', fontSize: 10, fontFamily: 'monospace', letterSpacing: 1 },
  featuredBadge: { borderWidth: 1, borderColor: '#00ff41', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  featuredText: { color: '#00ff41', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  projectTitle: { color: '#ffffff', fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  projectDesc: { color: '#e5e7eb', fontSize: 14, lineHeight: 22, marginBottom: 20 },
  projectLinks: { flexDirection: 'row', gap: 20, marginTop: 20, borderTopWidth: 1, borderTopColor: '#0a170f', paddingTop: 16 },
  projectLinkText: { color: '#00ff41', fontSize: 11, fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: 1 },

  // Experience Timeline
  timelineContainer: { borderLeftWidth: 1, borderLeftColor: '#0a170f', paddingLeft: 30, marginLeft: 10 },
  timelineItem: { marginBottom: 40, position: 'relative' },
  timelineDot: { position: 'absolute', left: -36, top: 4, width: 10, height: 10, borderRadius: 5, backgroundColor: '#00ff41' },
  timelineDate: { color: '#00ff41', fontSize: 10, fontFamily: 'monospace', letterSpacing: 1, marginBottom: 8 },
  timelineHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  timelineTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  completedBadge: { backgroundColor: 'rgba(0,255,65,0.1)', borderWidth: 1, borderColor: '#00ff41', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  completedText: { color: '#00ff41', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  timelineCompany: { color: '#00ff41', fontSize: 13, fontFamily: 'monospace', marginBottom: 12 },
  timelineDesc: { color: '#e5e7eb', fontSize: 14, lineHeight: 22, marginBottom: 12, maxWidth: 700 },

  // Certifications
  certsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  certCard: { flex: 1, minWidth: 350, backgroundColor: '#050a08', borderWidth: 1, borderColor: '#0a170f', borderRadius: 8, padding: 20, flexDirection: 'row', gap: 16 },
  certIconBox: { width: 50, height: 50, backgroundColor: '#030705', borderWidth: 1, borderColor: '#0a170f', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  certContent: { flex: 1 },
  certTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  certIssuer: { color: '#00ff41', fontSize: 10, fontFamily: 'monospace', letterSpacing: 1, flex: 1 },
  verifiedBadge: { borderWidth: 1, borderColor: '#00ff41', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  verifiedText: { color: '#00ff41', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  certTitle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },

  // Contact
  contactGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 60 },
  contactLeft: { flex: 1, minWidth: 300 },
  contactIntro: { color: '#e5e7eb', fontSize: 16, lineHeight: 26, marginBottom: 30 },
  contactInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: '#050a08', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#0a170f' },
  contactIcon: { width: 32, height: 32, borderRadius: 4, backgroundColor: '#030705', alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 1, borderColor: '#0a170f' },
  contactInfoText: { color: '#00ff41', fontSize: 13, fontFamily: 'monospace' },
  
  contactForm: { flex: 1, minWidth: 300 },
  formLabel: { color: '#00ff41', fontSize: 11, fontFamily: 'monospace', letterSpacing: 1, marginBottom: 8 },
  formInput: { backgroundColor: '#050a08', borderWidth: 1, borderColor: '#0a170f', borderRadius: 4, color: '#ffffff', paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, marginBottom: 20 },
  formTextArea: { height: 120 },
  formSubmitBtn: { backgroundColor: '#00ff41', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 4, gap: 8 },
  formSubmitText: { color: '#030705', fontSize: 13, fontWeight: 'bold', letterSpacing: 1 },

  // CHATBOT WIDGET
  chatbotContainer: { position: 'absolute', right: 40, bottom: 110, width: 340, height: 430, backgroundColor: '#050a08', borderWidth: 1, borderColor: '#00ff41', borderRadius: 8, zIndex: 100, display: 'flex', flexDirection: 'column' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#0a170f' },
  chatDotsRow: { flexDirection: 'row' },
  termDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  chatTitle: { color: '#e5e7eb', fontSize: 11, fontFamily: 'monospace', marginLeft: 12 },
  chatMessageArea: { flex: 1, padding: 16 },
  chatBubble: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#0a170f', padding: 12, borderRadius: 6, marginBottom: 12 },
  chatHint: { borderColor: 'transparent' },
  chatText: { color: '#e5e7eb', fontSize: 12, fontFamily: 'monospace', lineHeight: 18 },
  chatInputContainer: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: '#0a170f' },
  chatInput: { flex: 1, backgroundColor: 'transparent', color: '#00ff41', fontSize: 12, fontFamily: 'monospace' },
  chatSendBtn: { backgroundColor: '#00ff41', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4, justifyContent: 'center' },
  chatSendText: { color: '#030705', fontSize: 12, fontWeight: 'bold' },

  // CHAT SLEEP / AWAKE TRIGGER BUTTON
  chatOpenFloatButtonContainer: { position: 'absolute', bottom: 30, right: 30, zIndex: 101 },
  chatToggleButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#050a08', borderWidth: 2, borderColor: '#00ff41', justifyContent: 'center', alignItems: 'center', shadowColor: '#00ff41', shadowOpacity: 0.5, shadowRadius: 10 },
  snoozeZzz: { position: 'absolute', top: -14, right: 0, fontSize: 18, fontWeight: 'bold', color: '#38bdf8' }
});