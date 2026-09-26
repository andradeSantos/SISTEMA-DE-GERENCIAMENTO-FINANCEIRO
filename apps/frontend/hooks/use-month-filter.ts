'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function useMonthFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const now = new Date();
  const mesAtual = searchParams.get('mes') ? parseInt(searchParams.get('mes')!) : now.getMonth() + 1;
  const anoAtual = searchParams.get('ano') ? parseInt(searchParams.get('ano')!) : now.getFullYear();

  function setPeriodo(novoMes: number, novoAno: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('mes', novoMes.toString());
    params.set('ano', novoAno.toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  function proximoMes() {
    if (mesAtual === 12) {
      setPeriodo(1, anoAtual + 1);
    } else {
      setPeriodo(mesAtual + 1, anoAtual);
    }
  }

  function mesAnterior() {
    if (mesAtual === 1) {
      setPeriodo(12, anoAtual - 1);
    } else {
      setPeriodo(mesAtual - 1, anoAtual);
    }
  }

  const nomeMes = MESES[mesAtual - 1];

  return {
    mes: mesAtual,
    ano: anoAtual,
    nomeMes,
    periodoFormatado: `${nomeMes} ${anoAtual}`,
    proximoMes,
    mesAnterior,
  };
}
