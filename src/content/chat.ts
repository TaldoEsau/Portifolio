import type { Locale } from "@/lib/locale";
import type { SceneId } from "@/lib/scenes";

export type ChatLine = {
  id: string;
  author: string;
  text: string;
};

const banks: Record<Locale, Record<SceneId, string[]>> = {
  pt: {
    intro: [
      "Setor 1 estável. Esta faixa é simulação de protocolo, não é chat de espectador.",
      "Piloto no registro: Esaú Santana. Estação taldosatis.",
      "Full stack no registro. LoveOn em produção e peças de portfólio no arquivo.",
      "Digite !ajuda para a lista de protocolos locais.",
    ],
    sobre: [
      "Registro do piloto aberto. Formação: ADS na UNIFUNEC.",
      "O texto de carreira ainda tem campos selados. Não invente o que não está no dossiê.",
      "Cinco etapas de engenharia estão no painel: reconhecimento até operação.",
    ],
    projetos: [
      "Arquivo de missão carregado. Cada cartão abre o dossiê em tela cheia.",
      "LoveOn está em produção. As outras peças são portfólio, sem cliente confirmado.",
      "Abra um cartão para a URL.",
    ],
    stack: [
      "Arsenal listado por uso em produção, sem barra de porcentagem.",
      "Redis segura resposta estruturada do Gemini. ffmpeg fecha o clipe vertical.",
      "Peça !projetos se quiser o fluxo, não o logo.",
    ],
    lab: [
      "Laboratório da Orla. O player Remotion só baixa a composição quando este setor abre.",
      "Radar de commits fica oculto sem token de leitura.",
      "Se a Helix marcar a live, o monitor sintoniza o embed oficial.",
    ],
    contato: [
      "Frequência de contato. E-mail, LinkedIn e GitHub estão no painel.",
      "Canal confirmado: twitch.tv/taldosatis.",
      "Use COPIAR só no dado que estiver impresso no painel.",
    ],
  },
  en: {
    intro: [
      "Sector 1 holding. This band is a protocol simulation, not a viewer chat.",
      "Pilot on file: Esaú Santana. Station taldosatis.",
      "Full stack on file. LoveOn is in production, and the archive holds portfolio pieces.",
      "Type !ajuda or !help for the local protocol list.",
    ],
    sobre: [
      "Pilot record open. Degree: systems analysis at UNIFUNEC.",
      "Career fields that are still sealed stay sealed.",
      "Five engineering steps are on the panel, from recon to operations.",
    ],
    projetos: [
      "Mission archive loaded. Each card opens the dossier full screen.",
      "LoveOn is in production. The other pieces are portfolio work, with no confirmed client.",
      "Open a card for the URL.",
    ],
    stack: [
      "Arsenal listed by production use. No percentage bars.",
      "Redis holds structured Gemini output. ffmpeg finishes the vertical clip.",
      "Use !projetos for the flow, not a logo wall.",
    ],
    lab: [
      "Outer Rim lab. The Remotion player downloads a composition only after this sector opens.",
      "The commit radar stays hidden without a read-only token.",
      "If Helix reports the channel live, the monitor loads the official embed.",
    ],
    contato: [
      "Contact frequency. Email, LinkedIn, and GitHub are on the panel.",
      "Confirmed channel: twitch.tv/taldosatis.",
      "Copy only the value printed on the panel.",
    ],
  },
};

export function sectorLines(locale: Locale, scene: SceneId): ChatLine[] {
  return banks[locale][scene].map((text, index) => ({
    id: `${locale}-${scene}-${index}`,
    author: index % 2 === 0 ? "[DROID_LOG]" : "[ASTROMECH_04]",
    text,
  }));
}

export function reactionLine(
  locale: Locale,
  type: string,
  detail: string,
): ChatLine {
  const text =
    locale === "en"
      ? reactionEn(type, detail)
      : reactionPt(type, detail);
  return {
    id: `rx-${type}-${detail}-${Date.now()}`,
    author: type === "interferencia" || type === "raid" ? "[REBEL_BASE]" : "[DROID_LOG]",
    text,
  };
}

function reactionPt(type: string, detail: string) {
  if (type === "scene") return `Setor ${detail} selecionado. Log simulado, sem uplink.`;
  if (type === "dossier") return `Dossiê ${detail} expandido no visor.`;
  if (type === "holocron") return "Holocron gravado nesta sessão. Coordenadas no clipboard local.";
  if (type === "interferencia") return "Interceptação !interferencia. Protocolo teatral de 1 ciclo. Nada foi apagado.";
  if (type === "raid") return "Sinal !raid marcado como transmissão simulada. Nenhum raid real foi enviado.";
  return "Evento local registrado.";
}

function reactionEn(type: string, detail: string) {
  if (type === "scene") return `Sector ${detail} selected. Simulated log, no uplink.`;
  if (type === "dossier") return `Dossier ${detail} expanded on the visor.`;
  if (type === "holocron") return "Holocron burned this session. Coordinates are on the local clipboard.";
  if (type === "interferencia") return "Intercept !interferencia. One theatrical cycle. Nothing was deleted.";
  if (type === "raid") return "Signal !raid flagged as a simulated transmission. No real raid was sent.";
  return "Local event stored.";
}
