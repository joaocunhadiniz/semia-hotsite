export type Lang = 'pt' | 'en'

export const t = {
  nav: {
    about:        { pt: 'Sobre',        en: 'About' },
    speakers:     { pt: 'Palestrantes', en: 'Speakers' },
    schedule:     { pt: 'Programação',  en: 'Schedule' },
    roundtables:  { pt: 'Mesas',        en: 'Roundtables' },
    register:     { pt: 'Inscrição',    en: 'Register' },
  },

  hero: {
    edition:   { pt: '2ª Edição',      en: '2nd Edition' },
    subtitle:  { pt: 'Semiótica e Inteligência Artificial', en: 'Semiotics and Artificial Intelligence' },
    tagline:   {
      pt: 'Decolonialidade, multilateralismo epistêmico e as fronteiras da significação na era da IA',
      en: 'Decoloniality, epistemic multilateralism, and the frontiers of signification in the AI era',
    },
    date:      { pt: '30 de novembro de 2026', en: 'November 30, 2026' },
    location:  { pt: 'ECA — Universidade de São Paulo', en: 'ECA — University of São Paulo' },
    cta:       { pt: 'Inscreva-se',    en: 'Register Now' },
  },

  about: {
    label:   { pt: 'Sobre o Evento', en: 'About the Event' },
    title:   {
      pt: 'Na fronteira do conhecimento',
      en: 'At the frontier of knowledge',
    },
    body:    {
      pt: 'O rizoma não tem começo nem fim. Como o micélio que percorre a terra antes de emergir, o conhecimento decolonial se expande por baixo das infraestruturas, contorna os nós de controle, perfura as camadas de poder sedimentadas em cada modelo, em cada dataset, em cada decisão arquitetural "neutra".',
      en: 'The rhizome has no beginning or end. Like mycelium threading through the earth before it surfaces, decolonial knowledge spreads beneath infrastructures, bypasses nodes of control, punctures layers of power sedimented in every model, every dataset, every "neutral" architectural decision.',
    },
    body2: {
      pt: 'No semIA II teremos pesquisadores do Sul e do Norte, semiótica e IA, corpo e máquina. E vamos interrogar assimetrias para imaginar futuros autônomos e diversos, por mais que isso pareça um contrasenso.',
      en: 'At semIA II we will bring together researchers from the South and the North, semiotics and AI, body and machine. And we will interrogate asymmetries to imagine autonomous and diverse futures — even if that sounds like a contradiction.',
    },
    stat1: { pt: '80–100 presenciais', en: '80–100 in-person' },
    stat2: { pt: '200–300 remotos',    en: '200–300 remote' },
    stat3: { pt: '2 conferências',     en: '2 keynotes' },
    stat4: { pt: '3 mesas paralelas',  en: '3 parallel roundtables' },
  },

  speakers: {
    label:      { pt: 'Palestrantes', en: 'Speakers' },
    title:      { pt: 'Vozes convidadas', en: 'Invited voices' },
    international: { pt: 'Convidado Internacional', en: 'International Guest' },
    national:      { pt: 'Convidada Nacional',       en: 'National Guest' },
    ali: {
      bio: {
        pt: 'Docente da School of Computing and Communications da The Open University (UK) e co-organizador do projeto Histories of Artificial Intelligence: A Genealogy of Power (Universidade de Cambridge). Sua pesquisa articula fenomenologia heideggeriana, teoria crítica da raça e pensamento decolonial para examinar como raça, política e ética se entrelaçam com sistemas de IA e governança da internet.',
        en: 'Faculty at the School of Computing and Communications, The Open University (UK), and co-organiser of the Histories of Artificial Intelligence: A Genealogy of Power project (University of Cambridge). His research articulates Heideggerian phenomenology, critical race theory, and decolonial thought to examine how race, politics, and ethics intertwine with AI systems and internet governance.',
      },
      talk: {
        pt: '"Decolonial Computing, Semiosis and the Politics of AI"',
        en: '"Decolonial Computing, Semiosis and the Politics of AI"',
      },
    },
    lima: {
      bio: {
        pt: 'Professora adjunta na UFPB (Departamento de Linguística e Língua Portuguesa). Doutora em Semiótica e Linguística Geral pela USP, com estágio doutoral na Université de Liège (Bélgica). Pesquisa em semiótica discursiva, textualização, IA e big data. Publicou em 2025 "Semiótica e IA generativa: a questão da figurativização visual e seus desafios ético-raciais".',
        en: 'Associate Professor at UFPB (Department of Linguistics and Portuguese Language). PhD in Semiotics and General Linguistics from USP, with a doctoral internship at the Université de Liège (Belgium). Research in discursive semiotics, textualization, AI and big data. Published in 2025 "Semiotics and Generative AI: the question of visual figurativization and its ethical-racial challenges".',
      },
      talk: {
        pt: '"Semiótica e IA Generativa: figurativização e desafios ético-raciais"',
        en: '"Semiotics and Generative AI: figurativization and ethical-racial challenges"',
      },
    },
  },

  schedule: {
    label:  { pt: 'Programação', en: 'Schedule' },
    title:  { pt: '30 de novembro de 2026', en: 'November 30, 2026' },
    lunch:  { pt: 'Almoço',      en: 'Lunch' },
    items: [
      { time: '09:00–09:30', pt: 'Abertura institucional — Direção ECA e coordenadores', en: 'Institutional opening — ECA Direction and coordinators', type: 'opening' },
      { time: '09:30–11:00', pt: 'Conferência Internacional — Dr. Syed Mustafa Ali', en: 'International Keynote — Dr. Syed Mustafa Ali', type: 'keynote' },
      { time: '11:15–12:30', pt: 'Mesa-redonda: Pesquisadores brasileiros em IA — perspectivas comunicacionais e semióticas', en: 'Roundtable: Brazilian researchers in AI — communicational and semiotic perspectives', type: 'roundtable' },
      { time: '12:30–14:00', pt: 'Almoço', en: 'Lunch', type: 'break' },
      { time: '14:00–15:30', pt: 'Conferência Nacional — Profa. Dra. Letícia Moraes Lima', en: 'National Keynote — Prof. Dr. Letícia Moraes Lima', type: 'keynote' },
      { time: '15:45–17:15', pt: 'Mesas-redondas paralelas simultâneas (3 salas ECA)', en: 'Simultaneous parallel roundtables (3 ECA rooms)', type: 'parallel' },
      { time: '17:30–19:00', pt: 'Sessão de pôsteres e lançamentos de livros', en: 'Poster session and book launches', type: 'poster' },
      { time: '19:00', pt: 'Encerramento', en: 'Closing', type: 'closing' },
    ],
  },

  roundtables: {
    label: { pt: 'Mesas Paralelas', en: 'Parallel Sessions' },
    title: { pt: '15h45 — 17h15', en: '3:45 PM — 5:15 PM' },
    rooms: [
      {
        number: '01',
        pt: 'Semiótica, linguagem e modelos generativos',
        en: 'Semiotics, language, and generative models',
      },
      {
        number: '02',
        pt: 'Decolonialidade, algoritmos e poder',
        en: 'Decoloniality, algorithms, and power',
      },
      {
        number: '03',
        pt: 'IA, comunicação e práticas culturais',
        en: 'AI, communication, and cultural practices',
      },
    ],
  },

  registration: {
    label:       { pt: 'Inscrição',      en: 'Registration' },
    title:       { pt: 'Participe do evento', en: 'Join the event' },
    name:        { pt: 'Nome completo',  en: 'Full name' },
    email:       { pt: 'E-mail',         en: 'Email' },
    institution: { pt: 'Instituição',    en: 'Institution' },
    role:        { pt: 'Vínculo',        en: 'Role' },
    roles: {
      pt: ['Selecione...', 'Estudante de graduação', 'Estudante de pós-graduação', 'Docente / Pesquisador(a)', 'Profissional', 'Outro'],
      en: ['Select...', 'Undergraduate student', 'Graduate student', 'Faculty / Researcher', 'Professional', 'Other'],
    },
    modality:    { pt: 'Modalidade',     en: 'Attendance' },
    inPerson:    { pt: 'Presencial',     en: 'In-person' },
    remote:      { pt: 'Remoto (online)', en: 'Remote (online)' },
    submit:      { pt: 'Confirmar inscrição', en: 'Confirm registration' },
    success:     { pt: 'Inscrição realizada! Você receberá um e-mail de confirmação.', en: 'Registration complete! You will receive a confirmation email.' },
  },

  venue: {
    label:    { pt: 'Local', en: 'Venue' },
    title:    { pt: 'ECA — Escola de Comunicações e Artes', en: 'ECA — School of Communications and Arts' },
    address:  { pt: 'Av. Prof. Lúcio Martins Rodrigues, 443\nCidade Universitária, São Paulo/SP\nCEP 05508-020', en: 'Av. Prof. Lúcio Martins Rodrigues, 443\nCidade Universitária, São Paulo/SP\nZIP 05508-020' },
    note:     { pt: 'Auditório a confirmar • Com transmissão ao vivo', en: 'Auditorium to be confirmed • With live streaming' },
    university: { pt: 'Universidade de São Paulo', en: 'University of São Paulo' },
  },

  footer: {
    group:     { pt: 'Grupo de Pesquisa semIA', en: 'semIA Research Group' },
    groupSub:  { pt: 'Semiótica e Inteligência Artificial', en: 'Semiotics and Artificial Intelligence' },
    hosted:    { pt: 'Realização', en: 'Hosted by' },
    contact:   { pt: 'Contato', en: 'Contact' },
    rights:    { pt: 'Todos os direitos reservados.', en: 'All rights reserved.' },
  },
}
