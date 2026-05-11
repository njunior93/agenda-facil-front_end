import type { TipoServico } from "../../../data/servicos";

export interface IAgendamentoInput{
    data: string,
    hora: string,
    tipoServico: TipoServico;
    servico: string;
    cliente_id: string;
}