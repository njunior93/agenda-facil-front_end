export interface IAgendamentoOutput {
  id: string;
  tipoServico: string;
  servico: string;
  data: string;
  hora: string;
  status: string;
  cliente: { nome: string };
}
