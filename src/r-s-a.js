// Função para verificar se um número é primo
function isPrime(num) {
    for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
      if (num % i === 0) {
        return false;
      }
    }
    return num > 1;
  }
  
  // Função para calcular o máximo divisor comum (MDC) de dois números
  function gcd(a, b) {
    while (b !== 0) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }
  
  // Função para calcular o inverso multiplicativo usando o algoritmo de Euclides estendido
  function modInverse(e, phi) {
    let m0 = phi;
    let y = 0;
    let x = 1;
  
    while (e > 1) {
      let q = Math.floor(e / phi);
      let temp = phi;
      phi = e % phi;
      e = temp;
      temp = y;
      y = x - q * y;
      x = temp;
    }
  
    if (x < 0) {
      x += m0;
    }
  
    return x;
  }
  
  // Função para gerar as chaves pública e privada
  function generateRSAKeys() {
    let p, q, n, phi, e, d;
  
    // Gerar dois números primos grandes e diferentes
    do {
      p = Math.floor(Math.random() * 100) + 50;
    } while (!isPrime(p));
  
    do {
      q = Math.floor(Math.random() * 100) + 50;
    } while (!isPrime(q) || q === p);
  
    // Calcular o módulo
    n = p * q;
  
    // Calcular a função totiente de Euler
    phi = (p - 1) * (q - 1);
  
    // Escolher um número relativamente primo a phi
    do {
      e = Math.floor(Math.random() * phi);
    } while (gcd(e, phi) !== 1);
  
    // Calcular o inverso multiplicativo de e
    d = modInverse(e, phi);
  
    // Retornar as chaves pública e privada
    return {
      publicKey: { n, e },
      privateKey: { n, d }
    };
  }
  
  // Função para criptografar uma mensagem usando a chave pública
  function encrypt(message, publicKey) {
    let { n, e } = publicKey;
    let encrypted = "";
  
    for (let i = 0; i < message.length; i++) {
      let charCode = message.charCodeAt(i);
      let encryptedCharCode = BigInt(charCode) ** BigInt(e) % BigInt(n);
      encrypted += String.fromCharCode(Number(encryptedCharCode));
    }
  
    return encrypted;
  }
  
  // Função para decodificar uma mensagem criptografada usando a chave privada
  function decrypt(encryptedMessage, privateKey) {
    let { n, d } = privateKey;
    let decrypted = "";
  
    for (let i = 0; i < encryptedMessage.length; i++) {
      let charCode = encryptedMessage.charCodeAt(i);
      let decryptedCharCode = BigInt(charCode) ** BigInt(d) % BigInt(n);
      decrypted += String.fromCharCode(Number(decryptedCharCode));
    }
  
    return decrypted;
  }
  
  // Exemplo de uso
  function main(){
  let keys = generateRSAKeys();
  let publicKey = keys.publicKey;
  let privateKey = keys.privateKey;
  
  let message = "Pneumoultramicroscopicossilicovulcanoconiótico";
  let encryptedMessage = encrypt(message, publicKey);
  let decryptedMessage = decrypt(encryptedMessage, privateKey);
  
  console.log("Mensagem original:", message);
  console.log("Mensagem criptografada:", encryptedMessage);
  console.log("Mensagem decodificada:", decryptedMessage);
 }

module.exports= {
  isPrime,
  encrypt,
  decrypt,
  generateRSAKeys,
 }