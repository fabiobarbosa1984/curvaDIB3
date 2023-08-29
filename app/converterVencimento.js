// Função para converter o código do mês em número de mês
function codigoParaMes(codigo) {
  const meses = {
    'F': '01', 'G': '02', 'H': '03', 'J': '04', 'K': '05', 'M': '06',
    'N': '07', 'Q': '08', 'U': '09', 'V': '10', 'X': '11', 'Z': '12'
  };

  return meses[codigo.toUpperCase()] || null;
}
// Função para converter o valor da primeira coluna de vencimento
function converterVencimento(valorColuna1) {
  const match = valorColuna1.match(/^([a-zA-Z]+)(\d+)$/);
  if (match) {
    const primeiraParte = match[1];
    const segundaParte = match[2];
    return '01/' + codigoParaMes(primeiraParte) + '/20' + segundaParte;
  } else {
    return valorColuna1;
  }
}
exports.converterVencimento = converterVencimento;
