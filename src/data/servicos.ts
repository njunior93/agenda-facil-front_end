export type TipoServico =
  | "Manutenção"
  | "Instalação"
  | "Atendimento técnico"
  | "Consultoria"
  | "Entrega"
  | "Serviços gerais";

export const tiposServico: TipoServico[] = [
  "Manutenção",
  "Instalação",
  "Atendimento técnico",
  "Consultoria",
  "Entrega",
  "Serviços gerais"
];

export const servicosPorTipo: Record<TipoServico, string[]> = {
  Manutenção: [
    "Manutenção preventiva",
    "Manutenção corretiva",
    "Revisão geral",
    "Limpeza técnica"
  ],

  Instalação: [
    "Instalação de equipamento",
    "Configuração inicial",
    "Montagem",
    "Setup completo"
  ],

  "Atendimento técnico": [
    "Suporte técnico",
    "Diagnóstico de problema",
    "Visita técnica",
    "Correção de falha"
  ],

  Consultoria: [
    "Análise técnica",
    "Planejamento",
    "Avaliação de projeto",
    "Recomendação técnica"
  ],

  Entrega: [
    "Entrega simples",
    "Entrega com instalação",
    "Retirada de produto"
  ],

  "Serviços gerais": [
    "Atendimento externo",
    "Acompanhamento",
    "Serviço personalizado"
  ]
};