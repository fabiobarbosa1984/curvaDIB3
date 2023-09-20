// function to convert the string coded month to equivalent number in a MM format
function codeToMonth(code) {
  const months = {
    'F': '01', 'G': '02', 'H': '03', 'J': '04', 'K': '05', 'M': '06',
    'N': '07', 'Q': '08', 'U': '09', 'V': '10', 'X': '11', 'Z': '12'
  };

  return months[code.toUpperCase()] || null;
}
// Função para converter o valor da primeira coluna de vencimento
function codeToMaturity(v) {
  const match = v.match(/^([a-zA-Z]+)(\d+)$/);
  if (match) {
    const p1 = match[1];
    const p2 = match[2];
    return '01/' + codeToMonth(p1) + '/20' + p2;
  } else {
    return v;
  }
}
exports.codeToMaturity = codeToMaturity;
