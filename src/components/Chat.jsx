import React, { useState } from 'react';
import './Chat.css';
import Select from 'react-select';
import countries from 'i18n-iso-countries';
import spanish from 'i18n-iso-countries/langs/es.json';
import Papa from 'papaparse';



import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import fs from 'fs';

countries.registerLocale(spanish);
let countryOptions = Object.entries(countries.getNames('es')).map(([value, label]) => ({ value, label }));
countryOptions = [{ value: '', label: 'Selecciona el país...' }, ...countryOptions];

function Chat({ darkMode, onButtonClick, addQueryToHistory }) {
  const [nameProject, SI_nameProject] = useState('');
  const [duration, SI_duration] = useState('');
  const [description, SI_description] = useState('');
  const [scope, SI_scope] = useState('');
  const [objective, SI_objective] = useState('');
  const [requirements, SI_requirements] = useState('');
  const [profile, SI_profile] = useState('');
  const [availableHours, SI_availableHours] = useState('');
  const [country, SI_country] = useState('');
  const [output, setOutput] = useState('');
  const allOptions = ['Matutino (9:00 - 12:00)', 'Vespertino (12:00 - 18:00)', 'Nocturno (17:00 - 22:00)']; // Agrega todas tus opciones aquí
  const options = allOptions.map(option => ({ value: option, label: option }));
  const [detectedName, setDetectedName] = useState(null);

  const HIC_nameProject = (e) => {
    SI_nameProject(e.target.value);
  };

  const HIC_duration = (e) => {
    SI_duration(e.target.value);
  };

  const handleChange = (value) => {
    HIC_availableHours({ target: { value: value ? value.map(option => option.value) : [] } });
  }

  const HIC_description = (e) => {
    SI_description(e.target.value);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: darkMode ? '1px solid #fdfcfc' : '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: darkMode ? '#727272' : (state.isFocused ? '#fdfcfc' : '#fdfcfc'),
      color: darkMode ? '#fff' : '#333',
      boxShadow: state.isFocused ? '0 0 0 1px #aaa' : 'none',
      '&:hover': {
        borderColor: darkMode ? '#777' : '#aaa'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? (darkMode ? '#555' : '#ccc') : (state.isFocused ? (darkMode ? '#444' : '#eee') : (darkMode ? '#333' : '#fff')),
      color: darkMode ? '#fff' : '#333',
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
      return { ...provided, opacity, transition, color: darkMode ? '#fff' : '#333' };
    }
  };

  const HIC_scope = (e) => {
    SI_scope(e.target.value);
  };

  const HIC_objective = (e) => {
    SI_objective(e.target.value);
  };

  const HIC_requirements = (e) => {
    SI_requirements(e.target.value);
  };

  const HIC_profile = (e) => {
    SI_profile(e.target.value);
  };

  const HIC_availableHours = (e) => {
    if (e.target.value === 'all') {
      SI_availableHours(allOptions);
    } else {
      SI_availableHours(e.target.value);
    }
  };

  const generateTextFromCSV = () => {
    return new Promise((resolve, reject) => {
      Papa.parse('uploads/db_staff.csv', {
        download: true,
        header: true,
        complete: function (results) {
          let texto = "\n";
          results.data.forEach((row, i) => {
            texto += `${i + 1}. Nombre: ${row['Nombre']}\n`;
            texto += `   Experiencia en la Industria: ${row['Experiencia en la Industria']}\n`;
            texto += `   Años de Experiencia: ${row['Años de Experiencia']}\n`;
            texto += `   Idiomas: ${row['Idiomas']}\n`;
            texto += `   Zona Horaria: ${row['Zona Horaria']}\n`;
            texto += `   Horas Disponibles: ${row['Horas Disponibles']}\n`;
            texto += `   Certificaciones: ${row['Certificaciones']}\n`;
            texto += `   Developer Skills: ${row['Developer Skills']}\n`;
            texto += `   Disponible: ${row['Disponible']}\n\n`;
          });

          resolve(texto);
        },
        error: function (err) {
          reject(err);
        }
      });
    });
  };

  const handleSubmit = async () => {
    // Verifica si alguna de las variables es nula
    // Inicia el temporizador
    let count = 0;
    const timer = setInterval(() => {
      count++;
      let dots = '.';
      for (let i = 0; i < count % 3; i++) {
        dots += '.';
      }
      onButtonClick(dots);
    }, 500);

    // Espera 4 segundos
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Detiene el temporizador
    clearInterval(timer);

    // Aquí invocarás la API de generación de texto
    //debe retornar un html que es el resultado de la consulta

    const MODEL_NAME = "gemini-1.0-pro";
    const API_KEY = "AIzaSyDFYx1qgkKeBZzFhFs8SiZBJzezavMXw00";


    try {
      async function run() {
        const texto = await generateTextFromCSV();
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const generationConfig = {
          temperature: 1,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        };

        const safetySettings = [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
        ];

        const parts = [
          { text: "Prompt:\n\nBasado en las características del proyecto proporcionado y las habilidades de los miembros del staff de la lista, elige al consultor con el porcentaje más alto de compatibilidad para este proyecto y proporciona su nombre.\n\nInput:\n\nDescripción del Proyecto: [Descripción del proyecto]\nAlcances: [Alcances del proyecto]\nObjetivos: [Objetivos del proyecto]\nDuración Estimada: [Duración estimada del proyecto]\nRequisitos del Proyecto: [Requisitos del proyecto]\nPerfil de Equipo Ideal: [Perfil de equipo ideal]\nInformación del Cliente: [Información del cliente]\n\n\n\n**CRITERIOS DE EVALUACIÓN:**\n\n* **Experiencia en la Industria:** Se prioriza la experiencia en logística y/o industrias relacionadas para comprender las necesidades específicas del cliente.\n\n* **Habilidades Técnicas:** Se buscan habilidades en desarrollo web y móvil, algoritmos de optimización y sistemas de seguimiento GPS.\n\n* **Certificaciones:** \nSe valoran certificaciones relevantes para la gestión de proyectos y metodologías ágiles.\n\n* **Ubicación y Disponibilidad:** Se considera la zona horaria y la disponibilidad para facilitar la comunicación y colaboración con el cliente ubicado en Ciudad de México.\n\n\n\nStaff:\n\n1. Nombre: [Nombre del consultor]\n   - Experiencia en la Industria: [Experiencia en la industria del consultor]\n   - Años de Experiencia: [Años de experiencia del consultor]\n   - Idiomas: [Idiomas del consultor]\n   - Zona Horaria: [Zona horaria del consultor]\n   - Horas Disponibles: [Horas disponibles del consultor]\n   - Certificaciones: [Certificaciones del consultor]\n   - Developer Skills: [Habilidades de desarrollo del consultor]\n\n2. Nombre: [Nombre del consultor]\n   - Experiencia en la Industria: [Experiencia en la industria del consultor]\n   - Años de Experiencia: [Años de experiencia del consultor]\n   - Idiomas: [Idiomas del consultor]\n   - Zona Horaria: [Zona horaria del consultor]\n   - Horas Disponibles: [Horas disponibles del consultor]\n   - Certificaciones: [Certificaciones del consultor]\n   - Developer Skills: [Habilidades de desarrollo del consultor]\n\n3. Nombre: [Nombre del consultor]\n   - Experiencia en la Industria: [Experiencia en la industria del consultor]\n   - Años de Experiencia: [Años de experiencia del consultor]\n   - Idiomas: [Idiomas del consultor]\n   - Zona Horaria: [Zona horaria del consultor]\n   - Horas Disponibles: [Horas disponibles del consultor]\n   - Certificaciones: [Certificaciones del consultor]\n   - Developer Skills: [Habilidades de desarrollo del consultor]\n\nEjemplo:\n\n**Descripción del Proyecto:** Crear una plataforma web y móvil para consultas médicas virtuales que permita a los pacientes agendar citas, comunicarse con médicos, y acceder a sus historiales médicos de forma segura.\n**Duración Estimada:** 7 meses\n**Presupuesto:** $280,000\n**Requisitos del Proyecto:** Experiencia en desarrollo de plataformas web y móviles, conocimientos en seguridad de datos de salud (HIPAA), capacidad para integrar sistemas de videoconferencia y gestión de registros médicos electrónicos (EMR).\n**Perfil de Equipo Ideal:** Desarrolladores Full-stack con experiencia en telemedicina y seguridad de datos de salud.\n**Información del Cliente:** Instituciones Médicas, Ubicación: Toronto, Canadá. Horario disponible: Diurna\n\nRespuesta:\n**Análisis de Consultores para el Proyecto de Plataforma de Telemedicina:**\nBasándome en la información proporcionada, **María Rodríguez parece ser la consultora más adecuada para el proyecto**, con una compatibilidad estimada del **85%**.\nAnálisis de María Rodríguez:\n•\tExperiencia en la Industria: María tiene una sólida experiencia en tecnología y salud, lo que la hace especialmente adecuada para el proyecto de telemedicina.\n•\tHabilidades de Desarrollo: Sus habilidades en Java, Spring Framework y SQL son relevantes para el desarrollo de plataformas web y móviles. Su experiencia en Docker y Jenkins también puede ser valiosa para la gestión de la infraestructura.\n•\tCertificaciones Relevantes: Las certificaciones AWS Certified Solutions Architect y CompTIA Healthcare IT Technician indican su conocimiento en la nube y en los estándares de seguridad de datos de salud, respectivamente.\n•\tIdiomas y Disponibilidad Horaria: Su dominio del inglés y su horario disponible en la zona horaria del cliente facilitarán la comunicación y colaboración con las instituciones médicas en Toronto, Canadá.\nConclusión:\n•\tMaría Rodríguez posee una combinación de habilidades técnicas y experiencia en el dominio de la salud que la hacen ideal para liderar el desarrollo de la plataforma de telemedicina.\nRecomendación:\n•\tSe recomienda que María Rodríguez continúe capacitándose en las últimas tecnologías y estándares de seguridad de datos de salud para mantenerse actualizada en un campo en constante evolución.\n\n\nStaff: [Lista del staff con sus características]\n" + (texto ?? '') },
          { text: "INPUT 1: DESCRIPCION GENERAL Descripción,Desarrollo de una aplicación móvil para el aprendizaje de idiomas. Alcances,La aplicación debe ofrecer lecciones interactivas, ejercicios de pronunciación y seguimiento del progreso del usuario. Objetivos,Mejorar las habilidades de los usuarios en el idioma elegido, ofrecer una experiencia de aprendizaje personalizada y gamificada." },
          { text: "INPUT 2: DURACIÓN Duración,4 meses" },
          { text: "INPUT 3: REQUISITOS Requisitos,Experiencia en desarrollo móvil, tecnologías de aprendizaje automático para reconocimiento de voz, diseño de interfaces gamificadas. Equipo Ideal,Desarrolladores móviles con experiencia en gamificación y aprendizaje de idiomas. Zona horaria de cliente,GMT+1: Madrid Horario disponible,Vespertino" },
          { text: "OUTPUT 1: ANALISIS Ana García. Porcentaje de compatibilidad: 90% Experiencia en la industria,Su experiencia en EdTech y desarrollo de software la hace familiar con las necesidades del proyecto. Dado que Ana García cumple con la mayoría de los requisitos y tiene habilidades y experiencia relevantes para el proyecto, podríamos evaluar su compatibilidad con el proyecto en un alto porcentaje, aproximadamente del 90%. Esto significa que Ana es una opción muy adecuada y bien calificada para liderar el desarrollo de la aplicación de aprendizaje de idiomas.  Habilidades de desarrollo,Posee habilidades en desarrollo móvil con Java, Kotlin y React Native, tecnologías ideales para la aplicación. Su conocimiento de TensorFlow también es valioso para implementar funcionalidades de reconocimiento de voz. Idiomas,Su dominio del español e inglés facilita la comunicación con el cliente. Zona horaria,Su zona horaria GMT+1 permite una buena sincronización con el cliente en Madrid. Certificación Scrum Master,Demuestra su capacidad para trabajar en proyectos ágiles. Una recomendación puntual adicional para Ana García sería fomentar su desarrollo profesional continuo mediante la participación en comunidades de desarrollo de software y la asistencia a conferencias y eventos relacionados con la tecnología educativa y el aprendizaje de idiomas." },
          { text: "INPUT 1: DESCRIPCION GENERAL Crear una plataforma web de e-learning para empresas que permita la capacitación y seguimiento del progreso de los empleados en diversos cursos y programas de formación." },
          { text: "INPUT 2: DURACIÓN 8 meses" },
          { text: "INPUT 3: REQUISITOS Requisitos del Proyecto:** Experiencia en desarrollo de plataformas web, conocimientos en diseño de experiencias de usuario (UX), capacidad para integrar sistemas de gestión de aprendizaje (LMS).\n**Perfil de Equipo Ideal:** Desarrolladores Full-stack con experiencia en e-learning y diseño UX/UI.\n**Información del Cliente:** Empresas de diversos sectores, Ubicación: Nueva York, Estados Unidos. Zona horaria: GMT – 4, Horario disponible: Diurno" },
          { text: "OUTPUT 1: ANALISIS **Análisis de Consultores para el Proyecto de Plataforma de E-learning:**\nBasándome en la información proporcionada, **Laura García parece ser la consultora más adecuada para el proyecto**, con una compatibilidad estimada del **90%**.\n•\tAnálisis \nExperiencia en la Industria: Laura tiene una sólida experiencia en tecnología, especialmente en el ámbito del comercio electrónico, lo que le proporciona una comprensión profunda de las necesidades y expectativas de los usuarios en entornos web.\n•\tHabilidades de Desarrollo: Su dominio de tecnologías como PHP, Laravel y Vue.js la posicionan como una candidata idónea para el desarrollo de la plataforma web de e-learning.\n•\tCertificaciones Relevantes: La certificación como Scrum Master demuestra su capacidad para gestionar proyectos de manera ágil y eficiente, lo cual es crucial para un proyecto de esta envergadura.\n•\tIdiomas y Disponibilidad Horaria: Su dominio del inglés, combinado con su disponibilidad durante el horario diurno en la zona horaria del cliente, facilita la comunicación y coordinación con los clientes en Nueva York.\n\nConclusión \n•\tLa experiencia y habilidades de Laura García la convierten en la opción más compatible y calificada para liderar el desarrollo de la plataforma de e-learning.\nRecomendación:\n•\tSe recomienda que Laura García continúe actualizando sus habilidades en diseño de experiencias de usuario (UX) para asegurar que la plataforma resultante no solo sea funcional, sino también altamente intuitiva y atractiva para los usuarios finales." },
          { text: "INPUT 1: DESCRIPCION GENERAL Crear una aplicación móvil y web que permita a equipos remotos gestionar proyectos, asignar tareas, realizar seguimiento del progreso y colaborar en tiempo real." },
          { text: "INPUT 2: DURACIÓN 6 meses" },
          { text: "INPUT 3: REQUISITOS **Requisitos del Proyecto:** Experiencia en desarrollo de aplicaciones móviles y web, conocimientos en metodologías ágiles de gestión de proyectos, capacidad para integrar sistemas de videoconferencia.\n**Perfil de Equipo Ideal:** Desarrolladores Full-stack con experiencia en trabajo remoto y metodologías ágiles.\n**Información del Cliente:** Empresas con equipos distribuidos globalmente, Ubicación: Londres, Reino Unido. Zona horaria: GMT + 0, Horario disponible: Diurno" },
          { text: "OUTPUT 1: ANALISIS **Análisis de Consultores para el Proyecto de Aplicación de Gestión de Proyectos:**\nBasándome en la información proporcionada, **Andrés Sánchez parece ser el consultor más adecuado para el proyecto**, con una compatibilidad estimada del **85%**.\nAnálisis de Andrés Sánchez:\n•\tExperiencia en la Industria: Andrés tiene una sólida experiencia en tecnología y consultoría, lo que le proporciona una comprensión profunda de los procesos empresariales y de gestión de proyectos.\n•\tHabilidades de Desarrollo: Su experiencia en JavaScript, Node.js, y React.js lo hace apto para el desarrollo tanto de la aplicación móvil como web requerida en el proyecto.\n•\tCertificaciones Relevantes: Las certificaciones en AWS y Scrum Master demuestran su capacidad técnica y habilidades de gestión, esenciales para un proyecto de esta naturaleza.\n•\tIdiomas y Disponibilidad Horaria: Su dominio del inglés y su horario disponible en la zona horaria del cliente facilitan la comunicación y colaboración con los equipos en Londres.\nConclusión:\n•\tLa combinación de experiencia técnica, habilidades de gestión y disponibilidad horaria hacen de Andrés Sánchez la opción más compatible y calificada para liderar el desarrollo de la aplicación de gestión de proyectos.\nRecomendación:\n•\tSe recomienda que Andrés Sánchez continúe actualizando sus habilidades en integración de sistemas de videoconferencia para asegurar una implementación exitosa de esta funcionalidad en la aplicación." },
          { text: "INPUT 1: DESCRIPCION GENERAL Crear una plataforma de comercio electrónico personalizable y fácil de usar para pequeñas empresas, que les permita vender sus productos en línea de manera efectiva." },
          { text: "INPUT 2: DURACIÓN 5 meses" },
          { text: "INPUT 3: REQUISITOS **Presupuesto:** $200,000\n**Requisitos del Proyecto:** Experiencia en desarrollo de plataformas de comercio electrónico, conocimientos en diseño UX/UI, capacidad para integrar sistemas de pago y gestión de inventarios.\n**Perfil de Equipo Ideal:** Desarrolladores Full-stack con experiencia en comercio electrónico y diseño UX/UI.\n**Información del Cliente:** Pequeñas Empresas, Ubicación: Toronto, Canadá. Horario disponible: Nocturno" },
          { text: "OUTPUT 1: ANALISIS **Análisis de Consultores para el Proyecto de Plataforma de Comercio Electrónico:**\nBasándome en la información proporcionada, **David Kim parece ser el consultor más adecuado para el proyecto**, con una compatibilidad estimada del **75%**.\nAnálisis de David Kim:\n•\tExperiencia en la Industria: David tiene experiencia en tecnología y finanzas, aunque su experiencia específica en comercio electrónico no se menciona directamente, su conocimiento en desarrollo web y tecnologías como JavaScript, Node.js y React.js lo hacen apto para el proyecto.\n•\tHabilidades de Desarrollo: Las habilidades de David en desarrollo web y su experiencia con tecnologías de contenedorización como Kubernetes y Docker son relevantes para la construcción de una plataforma de comercio electrónico.\n•\tCertificaciones Relevantes: Si bien las certificaciones de David están más orientadas hacia la arquitectura y seguridad de sistemas, su conocimiento técnico podría ser aplicado de manera efectiva en el proyecto.\n•\tIdiomas y Disponibilidad Horaria: Su dominio del inglés y su horario disponible en la zona horaria del cliente permitirían una comunicación efectiva y una colaboración fluida con las pequeñas empresas en Toronto.\nConclusión:\n•\tAunque David no tiene una experiencia directa en comercio electrónico, sus habilidades técnicas y su disponibilidad horaria lo hacen adecuado para el proyecto.\nRecomendación:\n•\tSe recomienda que David Kim profundice en su comprensión de los requisitos específicos del comercio electrónico y busque capacitación adicional si es necesario para mejorar su adaptabilidad al proyecto." },
          { text: "INPUT 1: DESCRIPCION GENERAL Desarrollar una aplicación móvil para la gestión de finanzas personales que permita a los usuarios realizar un seguimiento de sus gastos, crear presupuestos y recibir consejos financieros personalizados." },
          { text: "INPUT 2: DURACIÓN 4 meses" },
          { text: "INPUT 3: REQUISITOS **Presupuesto:** $120,000\n**Requisitos del Proyecto:** Experiencia en desarrollo de aplicaciones móviles, conocimientos en seguridad de datos financieros, capacidad para integrar sistemas de análisis de datos.\n**Perfil de Equipo Ideal:** Desarrolladores Full-stack con experiencia en aplicaciones móviles y seguridad de datos.\n**Información del Cliente:** Usuarios finales, Ubicación: Sydney, Australia. Horario disponible: Vespertina" },
          { text: "OUTPUT 1: ANALISIS **Análisis de Consultores para el Proyecto de Aplicación de Gestión de Finanzas Personales:**\nBasándome en la información proporcionada, **Laura García parece ser la consultora más adecuada para el proyecto**, con una compatibilidad estimada del **80%**.\nAnálisis de Laura García:\n•\tExperiencia en la Industria: Aunque Laura tiene experiencia principalmente en tecnología y eCommerce, su experiencia en el desarrollo de aplicaciones web podría ser aplicada eficazmente al desarrollo de la aplicación móvil para la gestión de finanzas personales.\n•\tHabilidades de Desarrollo: Laura posee habilidades en tecnologías como PHP, Laravel y Vue.js, que son relevantes para el desarrollo de aplicaciones web y podrían ser transferidas al desarrollo móvil con la orientación adecuada.\n•\tCertificaciones Relevantes: Si bien sus certificaciones no están directamente relacionadas con la gestión de finanzas personales, su conocimiento en seguridad de datos (CompTIA Security+) podría ser beneficioso para garantizar la seguridad de la aplicación.\n•\tIdiomas y Disponibilidad Horaria: Su dominio del inglés y su horario disponible en la zona horaria del cliente permitirían una comunicación efectiva y una colaboración fluida con los usuarios finales en Sydney, Australia.\nConclusión:\n•\tAunque Laura no tiene una experiencia directa en el desarrollo de aplicaciones móviles para finanzas personales, su experiencia en tecnología y eCommerce la hace una opción adecuada para el proyecto.\nRecomendación:\n•\tSe recomienda que Laura García se capacite en el desarrollo de aplicaciones móviles y adquiera conocimientos específicos sobre la gestión de finanzas personales para mejorar su adaptabilidad al proyecto." },
          { text: "INPUT 1: DESCRIPCION GENERAL Crear una plataforma web y móvil para consultas médicas virtuales que permita a los pacientes agendar citas, comunicarse con médicos, y acceder a sus historiales médicos de forma segura." },
          { text: "INPUT 2: DURACIÓN 7 meses" },
          { text: "INPUT 3: REQUISITOS **Presupuesto:** $280,000\n**Requisitos del Proyecto:** Experiencia en desarrollo de plataformas web y móviles, conocimientos en seguridad de datos de salud (HIPAA), capacidad para integrar sistemas de videoconferencia y gestión de registros médicos electrónicos (EMR).\n**Perfil de Equipo Ideal:** Desarrolladores Full-stack con experiencia en telemedicina y seguridad de datos de salud.\n**Información del Cliente:** Instituciones Médicas, Ubicación: Toronto, Canadá. Horario disponible: Diurna" },
          { text: "OUTPUT 1: ANALISIS **Análisis de Consultores para el Proyecto de Plataforma de Telemedicina:**\nBasándome en la información proporcionada, **María Rodríguez parece ser la consultora más adecuada para el proyecto**, con una compatibilidad estimada del **85%**.\nAnálisis de María Rodríguez:\n•\tExperiencia en la Industria: María tiene una sólida experiencia en tecnología y salud, lo que la hace especialmente adecuada para el proyecto de telemedicina.\n•\tHabilidades de Desarrollo: Sus habilidades en Java, Spring Framework y SQL son relevantes para el desarrollo de plataformas web y móviles. Su experiencia en Docker y Jenkins también puede ser valiosa para la gestión de la infraestructura.\n•\tCertificaciones Relevantes: Las certificaciones AWS Certified Solutions Architect y CompTIA Healthcare IT Technician indican su conocimiento en la nube y en los estándares de seguridad de datos de salud, respectivamente.\n•\tIdiomas y Disponibilidad Horaria: Su dominio del inglés y su horario disponible en la zona horaria del cliente facilitarán la comunicación y colaboración con las instituciones médicas en Toronto, Canadá.\nConclusión:\n•\tMaría Rodríguez posee una combinación de habilidades técnicas y experiencia en el dominio de la salud que la hacen ideal para liderar el desarrollo de la plataforma de telemedicina.\nRecomendación:\n•\tSe recomienda que María Rodríguez continúe capacitándose en las últimas tecnologías y estándares de seguridad de datos de salud para mantenerse actualizada en un campo en constante evolución." },
          { text: "INPUT 1: DESCRIPCION GENERAL Descripción del Proyecto: Desarrollo de Plataforma de Gestión de Recursos Humanos (HRM)" },
          { text: "INPUT 2: DURACIÓN Duración Estimada: 8 meses" },
          { text: "INPUT 3: REQUISITOS Alcances: Crear una plataforma web y móvil que permita a las empresas gestionar eficientemente sus recursos humanos, incluyendo procesos de reclutamiento, evaluación del desempeño, gestión de capacitaciones y seguimiento de empleados.\nObjetivos: Implementar un sistema de reclutamiento y selección automatizado, integrar herramientas de evaluación del desempeño, desarrollar un módulo de capacitación en línea, y proporcionar un panel de control para administradores y empleados.\nRequisitos del Proyecto: Experiencia en desarrollo de aplicaciones web y móviles, conocimientos en gestión de recursos humanos y procesos de reclutamiento, familiaridad con sistemas de evaluación del desempeño.\nPerfil de Equipo Ideal: Desarrolladores Full-stack con experiencia en sistemas de gestión empresarial y recursos humanos.\nInformación del Cliente: Industria de Servicios, Ubicación: Madrid, España." },
          { text: "OUTPUT 1: ANALISIS **Análisis de Consultores para el Proyecto de Plataforma de Gestión de Recursos Humanos (HRM)**\n\nBasándome en la información proporcionada, **Andrés Sánchez parece ser el consultor más adecuado para el proyecto**, con una compatibilidad estimada del **90%**.\n\n**Análisis de Andrés Sánchez:**\n\n* **Experiencia en la Industria:** Andrés tiene una sólida experiencia en Consultoría y Tecnología, lo que le aporta una comprensión profunda de los procesos de gestión de recursos humanos y las necesidades de las empresas.\n\n* **Habilidades de Desarrollo:** Su dominio de JavaScript, Node.js y React.js lo hacen apto para el desarrollo tanto de la aplicación web como móvil de la plataforma HRM.\n\n* **Certificaciones Relevantes:** La certificación AWS Certified Developer y Agile Certified Practitioner indican su capacidad técnica y habilidades de gestión de proyectos, esenciales para un proyecto de esta envergadura.\n\n* **Idiomas y Disponibilidad Horaria:** Su dominio del inglés y su horario disponible en la zona horaria del cliente (GMT+1) facilitarían la comunicación y colaboración con el equipo en Madrid.\n\n**Conclusión:**\n\nLa experiencia técnica, las habilidades de gestión y la disponibilidad de Andrés Sánchez lo convierten en la opción más compatible y calificada para liderar el desarrollo de la plataforma de gestión de recursos humanos (HRM).\n\n**Recomendaciones:**\n\n* Se recomienda que Andrés continúe actualizando sus conocimientos en los procesos y prácticas específicos de gestión de recursos humanos para mejorar aún más su adaptabilidad al proyecto." },
          { text: "INPUT 1: DESCRIPCION GENERAL Desarrollo de Plataforma de Logística para Optimización de Rutas" },
          { text: "INPUT 2: DURACIÓN Duración Estimada: 6 meses" },
          { text: "INPUT 3: REQUISITOS Alcances: Crear una plataforma web y móvil que permita a las empresas de logística optimizar sus rutas de entrega, reduciendo costos y tiempos de entrega.Objetivos: Implementar algoritmos de optimización de rutas, integrar sistemas de seguimiento de vehículos en tiempo real, y desarrollar una interfaz intuitiva para usuarios finales y administradores.Requisitos del Proyecto: Experiencia en desarrollo de aplicaciones web y móviles, conocimientos en algoritmos de optimización, familiaridad con sistemas de seguimiento GPS.Perfil de Equipo Ideal: Desarrolladores Full-stack con experiencia en logística y sistemas de seguimiento.Información del Cliente: Industria de Logística, Ubicación: Ciudad de México, México." },
          { text: "OUTPUT 1: ANALISIS **Análisis de Consultores para el Proyecto de Plataforma de Logística:**\n\nBasándome en la información proporcionada, **Carolina Fernández parece ser la consultora más adecuada para el proyecto**, con una compatibilidad estimada del **90%**.\n\n**Análisis de Carolina Fernández:**\n* **Experiencia en la Industria:** Carolina tiene una sólida experiencia en tecnología y logística, lo que la hace especialmente calificada para este proyecto centrado en una plataforma de logística.\n* **Habilidades Técnicas:** Su dominio de Python, Django y PostgreSQL es relevante para el desarrollo de plataformas web y móviles, mientras que sus habilidades en Vue.js y Docker pueden ser valiosas para la gestión de la infraestructura.\n* **Certificaciones Relevantes:** Las certificaciones AWS Certified Solutions Architect y Cisco Certified Network Associate (CCNA) demuestran su conocimiento en la nube y en redes, respectivamente, lo cual es crucial para la optimización de rutas.\n* **Disponibilidad Horaria:** Su horario disponible en la zona horaria del cliente (GMT-5) facilitará la comunicación y la colaboración.\n* **Idiomas:** Su dominio del español y el inglés garantiza una comunicación fluida con todas las partes interesadas.\n\n**Conclusión:**\n\nLa combinación de la experiencia de Carolina Fernández en logística y sus habilidades técnicas la convierte en la consultora más compatible y calificada para liderar el desarrollo de la Plataforma de Logística para la Optimización de Rutas.\n\n**Recomendación:**\n\nAconsejaría a Carolina Fernández que se mantuviera actualizada sobre las últimas tecnologías y tendencias en optimización de rutas y sistemas de rastreo GPS para mejorar continuamente la plataforma." },
          { text: "INPUT 1: DESCRIPCION GENERAL Desarrollo de una plataforma de comercio electrónico para la venta de productos artesanales. La plataforma debe incluir características como carrito de compras, sistema de pago seguro y opciones de personalización para los vendedores." },
          { text: "INPUT 2: DURACIÓN 6 meses" },
          { text: "INPUT 3: REQUISITOS Experiencia en desarrollo de plataformas de comercio electrónico, conocimiento de sistemas de pago en línea, habilidades en diseño de interfaces intuitivas y experiencia en trabajo remoto. Equipo Ideal: Desarrolladores con experiencia en plataformas de venta en línea y diseño de experiencia de usuario. Zona horaria del cliente: GMT-7: Ciudad de México. Horario disponible: Matutino." },
          { text: "OUTPUT 1: ANALISIS Miembro del staff: Diego Pérez.\nPorcentaje de compatibilidad: 85%\nAnálisis:\nDiego Pérez destaca como la opción más compatible para liderar el desarrollo de la plataforma de comercio electrónico. Su experiencia en proyectos de eCommerce y habilidades técnicas en PHP, Laravel y MySQL lo hacen idóneo para el trabajo. Aunque no cumple con todos los requisitos específicos, su versatilidad y experiencia general lo hacen adecuado para el proyecto. Además, su fluidez en español e inglés facilita la comunicación con el cliente.  Se recomienda que Diego participe en capacitaciones adicionales sobre sistemas de pago en línea para fortalecer su perfil para este proyecto." },
          { text: "INPUT 1: DESCRIPCION GENERAL Desarrollo de una aplicación de gestión empresarial." },
          { text: "INPUT 2: DURACIÓN No especificado." },
          { text: "INPUT 3: REQUISITOS Experiencia en desarrollo de aplicaciones empresariales." },
          { text: "OUTPUT 1: ANALISIS Miembro del staff: Ricardo Gómez.\n\nPorcentaje de compatibilidad: 80%\n\nAnálisis:\nRicardo Gómez es una opción sólida para liderar el desarrollo de la aplicación de gestión empresarial. Su experiencia en tecnología y finanzas, junto con sus habilidades en Java, Spring Boot y PostgreSQL, lo hacen adecuado para el proyecto. Aunque faltan detalles sobre la duración del proyecto y requisitos específicos, su experiencia general lo hace un candidato viable. Su fluidez en español e inglés facilita la comunicación con el cliente. Se recomienda obtener más detalles sobre la duración del proyecto y requisitos específicos para una evaluación más precisa." },
          { text: "INPUT 1: DESCRIPCION GENERAL Desarrollo de una plataforma de aprendizaje en línea." },
          { text: "INPUT 2: DURACIÓN 6 meses" },
          { text: "INPUT 3: REQUISITOS No especificado." },
          { text: "OUTPUT 1: ANALISIS Miembro del staff: Andrés Sánchez.\n\nPorcentaje de compatibilidad: 85%\n\nAnálisis:\nAndrés Sánchez es una opción adecuada para liderar el desarrollo de la plataforma de aprendizaje en línea. Su experiencia en consultoría tecnológica y certificaciones en AWS y Azure lo hacen apto para el proyecto. Aunque faltan detalles sobre los requisitos específicos, su experiencia general en tecnología lo hace un candidato viable. Su fluidez en español e inglés facilita la comunicación con el cliente. Su zona horaria GMT-5 también permite una coordinación efectiva con el cliente. Se recomienda obtener más detalles sobre los requisitos del proyecto para una evaluación más precisa." },
          { text: "INPUT 1: DESCRIPCION GENERAL Desarrollo de una aplicación móvil para un proyecto de investigación" },
          { text: "INPUT 2: DURACIÓN 9 meses" },
          { text: "INPUT 3: REQUISITOS Experiencia en desarrollo móvil" },
          { text: "OUTPUT 1: ANALISIS Miembro del staff: Carlos Martínez.\n\nPorcentaje de compatibilidad: 85%\n\nAnálisis:\nCarlos Martínez es una opción sólida para liderar el desarrollo de la aplicación móvil para el proyecto de investigación. Su experiencia en tecnología y finanzas, junto con sus habilidades en Java, Spring Boot y Angular, lo hacen adecuado para el proyecto. Aunque faltan detalles sobre los requisitos específicos, su experiencia general en desarrollo móvil lo hace un candidato viable. Su fluidez en español e inglés facilita la comunicación con el cliente. Se recomienda obtener más detalles sobre los requisitos del proyecto para una evaluación más precisa." },
          { text: "INPUT 1: DESCRIPCION GENERAL Desarrollo de un sistema de seguimiento de ventas" },
          { text: "INPUT 2: DURACIÓN No especificado" },
          { text: "INPUT 3: REQUISITOS Experiencia en desarrollo de sistemas de seguimiento" },
          { text: "OUTPUT 1: ANALISIS Miembro del staff: Laura García.\n\nPorcentaje de compatibilidad: 75%\n\nAnálisis:\nLaura García es una opción adecuada para liderar el desarrollo del sistema de seguimiento de ventas. Su experiencia en tecnología y eCommerce, junto con sus habilidades en PHP, Laravel y MySQL, lo hacen apto para el proyecto. Aunque faltan detalles sobre la duración del proyecto y requisitos específicos, su experiencia general en desarrollo de sistemas lo hace un candidato viable. Su fluidez en español e inglés facilita la comunicación con el cliente.  Se recomienda obtener más detalles sobre la duración del proyecto y requisitos específicos para una evaluación más precisa." },
          { text: "INPUT 1: DESCRIPCION GENERAL Desarrollo de un sistema de reservas de viajes en línea para una agencia de turismo." },
          { text: "INPUT 2: DURACIÓN 10 meses" },
          { text: "INPUT 3: REQUISITOS Experiencia en desarrollo de sistemas de reservas en línea y conocimiento en integración de pasarelas de pago." },
          { text: "OUTPUT 1: ANALISIS Miembro del staff: Andrés Sánchez.\n\nPorcentaje de compatibilidad: 85%\n\nAnálisis:\nAndrés Sánchez es una opción sólida para liderar el desarrollo del sistema de reservas de viajes en línea. Su experiencia en consultoría tecnológica y certificaciones en AWS y Azure lo hacen apto para el proyecto. Aunque faltan detalles sobre los requisitos específicos, su experiencia general en desarrollo de sistemas y conocimientos en integración de pasarelas de pago lo hacen un candidato viable. Su fluidez en español e inglés facilita la comunicación con el cliente.  Se recomienda obtener más detalles sobre los requisitos del proyecto para una evaluación más precisa." },
          { text: "INPUT 1: DESCRIPCION GENERAL Desarrollo de una aplicación móvil para la gestión de tareas y proyectos" },
          { text: "INPUT 2: DURACIÓN 5 meses" },
          { text: "INPUT 3: REQUISITOS Experiencia en desarrollo de aplicaciones móviles y conocimiento en metodologías ágiles de gestión de proyectos" },
          { text: "OUTPUT 1: ANALISIS Miembro del staff: Laura García.\n\nPorcentaje de compatibilidad: 82%\n\nAnálisis:\nLaura García es una opción adecuada para liderar el desarrollo de la aplicación móvil para la gestión de tareas y proyectos. Su experiencia en tecnología y eCommerce, junto con sus habilidades en PHP, Laravel y MySQL, la hacen apta para el proyecto. Aunque faltan detalles sobre los requisitos específicos, su experiencia general en desarrollo de aplicaciones móviles y conocimientos en metodologías ágiles la hacen una candidata viable. Su fluidez en español e inglés facilita la comunicación con el cliente.  Se recomienda obtener más detalles sobre los requisitos del proyecto para una evaluación más precisa." },
          { text: "INPUT 1: DESCRIPCION GENERAL Desarrollo de una aplicación de gestión de proyectos para una agencia de marketing" },
          { text: "INPUT 2: DURACIÓN 9 meses" },
          { text: "INPUT 3: REQUISITOS Experiencia en desarrollo de aplicaciones empresariales" },
          { text: "OUTPUT 1: ANALISIS Miembro del staff: Diego Pérez.\n\nPorcentaje de compatibilidad: 80%\n\nAnálisis:\nDiego Pérez es una opción adecuada para liderar el desarrollo de la aplicación de gestión de proyectos. Su experiencia en tecnología y eCommerce, junto con sus habilidades en PHP, Laravel y MySQL, lo hacen apto para el proyecto. Aunque faltan detalles sobre los requisitos específicos, su experiencia general en desarrollo web y aplicaciones empresariales lo hace un candidato viable. Se recomienda obtener más detalles sobre los requisitos del proyecto para una evaluación más precisa" },
          { text: "INPUT 1: DESCRIPCION GENERAL Desarrollo de una aplicación de gestión de proyectos para una empresa de consultoría" },
          { text: "INPUT 2: DURACIÓN 9 meses" },
          { text: "INPUT 3: REQUISITOS Experiencia en desarrollo de aplicaciones empresariales.\nConocimientos en metodologías ágiles.\nHabilidades en diseño de interfaces intuitivas.\nCapacidad para trabajar en equipo y comunicarse eficazmente con los clientes." },
          { text: "OUTPUT 1: ANALISIS Candidato 1: Laura García\nPorcentaje de compatibilidad: 85%\n\nAnálisis:\nLaura García es una sólida opción para liderar el proyecto. Con experiencia en eCommerce y habilidades en PHP, Laravel y MySQL, está bien equipada para el desarrollo. Su certificación como Scrum Master y su fluidez en español e inglés son activos valiosos. Su zona horaria GMT-4 facilita la colaboración.\n\nCandidato 2: Carlos Martínez\nPorcentaje de compatibilidad: 85%\n\nAnálisis:\nCarlos Martínez también es una excelente opción. Con experiencia en tecnología y finanzas, y habilidades en Java, Spring Boot y Angular, tiene una sólida base. Aunque no está certificado en metodologías ágiles, su experiencia en el área es notable. Su fluidez en español e inglés y su zona horaria GMT-5 son beneficiosas para la comunicación y colaboración.\n\nSimilitudes:\n\nAmbos candidatos tienen una compatibilidad del 85%.\nTienen experiencia relevante y habilidades técnicas adecuadas.\nSu fluidez en múltiples idiomas y zonas horarias permite una comunicación efectiva y colaboración.\nDiferencias:\n\nLaura tiene experiencia específica en eCommerce, mientras que Carlos tiene experiencia en finanzas.\nLaura está certificada como Scrum Master, mientras que Carlos no tiene certificación en metodologías ágiles, pero tiene experiencia en el área." },
          { text: "INPUT 1: DESCRIPCION GENERAL Desarrollo de un sistema de gestión de inventario para una cadena de restaurantes" },
          { text: "INPUT 2: DURACIÓN 8 meses" },
          { text: "INPUT 3: REQUISITOS Experiencia en desarrollo de sistemas de gestión de inventario para empresas de hostelería.\nConocimientos en integración con sistemas de punto de venta y gestión de stock.\nHabilidades en diseño de interfaces para dispositivos móviles.\nCapacidad para trabajar en un entorno de alta demanda y ritmo rápido." },
          { text: "OUTPUT 1: ANALISIS Candidato: Andrés Sánchez\nPorcentaje de compatibilidad: 45%\n\nAnálisis:\nAndrés Sánchez tiene una compatibilidad del 45% con el proyecto. Aunque tiene experiencia en tecnología y consultoría, sus habilidades y certificaciones no están totalmente alineadas con los requisitos específicos del proyecto. Aunque tiene experiencia en JavaScript, Node.js y MongoDB, y certificaciones relevantes en la nube, carece de experiencia específica en el desarrollo de sistemas de gestión de inventario para la industria de la hostelería y conocimientos en integración con sistemas de punto de venta. Además, su disponibilidad horaria no coincide totalmente con las necesidades del proyecto. Se recomienda considerar otros candidatos que cumplan mejor con los requisitos específicos del proyecto." },
          { text: "INPUT 1: DESCRIPCION GENERAL Desarrollo de un sistema de gestión de recursos humanos para una empresa de tamaño mediano" },
          { text: "INPUT 2: DURACIÓN 10 meses" },
          { text: "INPUT 3: REQUISITOS Experiencia en desarrollo de sistemas de gestión empresarial.\nConocimientos en legislación laboral y gestión de nóminas.\nHabilidades en diseño de interfaces amigables para el usuario.\nCapacidad para integrar sistemas de terceros, como herramientas de reclutamiento." },
          { text: "OUTPUT 1: ANALISIS Candidato: María Rodríguez\nPorcentaje de compatibilidad: 40%\n\nAnálisis:\nMaría Rodríguez tiene una compatibilidad del 40% con el proyecto. Aunque tiene experiencia en tecnología y salud, sus habilidades y certificaciones no están alineadas completamente con los requisitos del proyecto. Su experiencia en Java y Spring Framework puede ser relevante, pero carece de experiencia específica en desarrollo de sistemas de gestión empresarial y conocimientos en legislación laboral. Aunque su certificación como AWS Solutions Architect es valiosa, otras habilidades necesarias para este proyecto no están cubiertas. Se recomienda buscar otros candidatos que cumplan mejor con los requisitos específicos del proyecto." },
          { text: "INPUT 1: DESCRIPCION GENERAL " + (nameProject ?? '') + ' ' + (description ?? '') },
          { text: "INPUT 2: DURACIÓN " + (duration ?? '') },
          { text: "INPUT 3: REQUISITOS " + (scope ?? '') + ' ' + (objective ?? '') + ' ' + (requirements ?? '') + ' ' + (profile ?? '') + ' ' + (availableHours ?? '') + ' ' + (country ?? '') },
          { text: "OUTPUT 1: ANALISIS " },
        ];

        const result = await model.generateContent({
          contents: [{ role: "user", parts }],
          generationConfig,
          safetySettings,
        });

        const response = result.response;

        if (!nameProject || !description || !objective || !requirements || !profile || !availableHours || !country) {
          onButtonClick('Por favor, completa todos los campos.');
          return;
        } else {
          // Llama a onButtonClick con el contenido que quieres mostrar
          // Agrega la consulta y la respuesta al historial
          addQueryToHistory(nameProject, response.text());
          onButtonClick(response.text());
        }
      }


      run();
    } catch (err) {
      onButtonClick('No se ha subido la base de datos de los staff, cargue primero la base de datos.');
      console.error(err);
    }

  };

  const clearInputs = () => {
    SI_nameProject('');
    SI_duration('');
    SI_description('');
    SI_scope('');
    SI_objective('');
    SI_requirements('');
    SI_profile('');
    SI_availableHours('');
    SI_country('');
  };

  return (
    <div>
      <button onClick={clearInputs}>
        <img src="src/assets/clean.png" alt="Limpiar inputs" />
      </button>

      <div className="input-container">
        <p>*Nombre del proyecto</p>
        <input type="text" className={darkMode ? 'input-short dark-mode' : 'input-short'} value={nameProject} placeholder="Ingresa un título breve y descriptivo..." onChange={HIC_nameProject} />
      </div>

      <div className="input-container">
        <p>Duración</p>
        <input type="text" className={darkMode ? 'input-short dark-mode' : 'input-short'} value={duration} placeholder="Indica el tiempo estimado..." onChange={HIC_duration} />
      </div>

      <div className="input-container">
        <p>*Descripción</p>
        <textarea type="text" className={darkMode ? 'input-paragraph dark-mode' : 'input-paragraph'} value={description} placeholder="Proporciona una breve explicación detallada del proyecto..." onChange={HIC_description} />
      </div>

      <div className="input-container">
        <p>*Alcance</p>
        <textarea type="text" className={darkMode ? 'input-paragraph dark-mode' : 'input-paragraph'} value={scope} placeholder="Detalle de las funciones y características principales..." onChange={HIC_scope} />
      </div>

      <div className="input-container">
        <p>*Objetivo</p>
        <textarea type="text" className={darkMode ? 'input-paragraph dark-mode' : 'input-paragraph'} value={objective} placeholder="Meta especifica que se espera lograr..." onChange={HIC_objective} />
      </div>

      <div className="input-container">
        <p>*Requisitos/Conocimientos</p>
        <textarea type="text" className={darkMode ? 'input-paragraph dark-mode' : 'input-paragraph'} value={requirements} placeholder="Habilidades técnicas y conocimientos necesarios..." onChange={HIC_requirements} />
      </div>

      <div className="input-container">
        <p>*Perfil requerido</p>
        <textarea type="text" className={darkMode ? 'input-paragraph dark-mode' : 'input-paragraph'} value={profile} placeholder="Descripción del tipo de experiencia y habilidades profesionales que se busca..." onChange={HIC_profile} />
      </div>

      <div className="input-container" style={{ marginBottom: '50px' }}>
        <p>*Horario disponible</p>
        <Select
          className={darkMode ? 'input-short dark-mode' : 'input-short'}
          options={options}
          isMulti
          onChange={handleChange}
          value={options.filter(option => availableHours.includes(option.value))}
          placeholder="Seleccionar..."
          styles={{
            ...customStyles,
            control: (provided) => ({
              ...provided,
              maxHeight: '50px',
              background: darkMode ? '#727272' : '#fff',
              color: darkMode ? '#fff' : '#333'
            }),
            valueContainer: (provided) => ({
              ...provided,
              maxHeight: '40px',
              overflow: 'auto',
              color: darkMode ? '#fff' : '#333'
            }),
            option: (provided) => ({
              ...provided,
              color: darkMode ? '#fff' : '#333',
              background: darkMode ? '#333' : '#fff'
            }),
            menu: (provided) => ({
              ...provided,
              background: darkMode ? '#333' : '#fff',
            }),
          }}
          menuPlacement='auto'

        />
      </div>

      <div className="input-container" style={{ marginBottom: '50px' }}>
        <p>*País</p>
        <Select
          className={darkMode ? 'input-short dark-mode' : 'input-short'}
          value={countryOptions.find(option => option.value === country)}
          placeholder="Selecciona el país..."
          onChange={option => SI_country(option.value)}
          options={countryOptions}
          styles={{
            control: (provided) => ({
              ...provided,
              maxHeight: '50px',
              background: darkMode ? '#727272' : '#fff',
              color: darkMode ? '#fff' : '#333'
            }),
            valueContainer: (provided) => ({
              ...provided,
              maxHeight: '40px',
              overflow: 'auto',
              color: darkMode ? '#fff' : '#333'
            }),
            option: (provided) => ({
              ...provided,
              color: darkMode ? '#fff' : '#333',
              background: darkMode ? '#333' : '#fff'
            }),
            menu: (provided) => ({
              ...provided,
              background: darkMode ? '#333' : '#fff',
            }),
            singleValue: (provided) => ({
              ...provided,
              color: darkMode ? '#fff' : '#333',
            }),
            input: (provided) => ({
              ...provided,
              color: darkMode ? '#fff' : '#333', // color del texto mientras escribes
            }),
          }}
          menuPlacement='auto'
        />
      </div>

      <center>
        <button className="button" onClick={handleSubmit}>Generar</button>
        {output && <p>{output}</p>}
      </center>

    </div>
  );
};

export default Chat;