
import React, { useState, useEffect } from 'react';
import { LockIcon, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('média');

  // Gera uma senha baseada nas configurações atuais
  const generatePassword = () => {
    let charset = '';
    let newPassword = '';

    if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Verificar se pelo menos um conjunto de caracteres está selecionado
    if (charset === '') {
      // Se nenhum conjunto for selecionado, ativar letras minúsculas por padrão
      charset = 'abcdefghijklmnopqrstuvwxyz';
      setUseLowercase(true);
    }

    // Gerar a senha
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }

    setPassword(newPassword);
  };

  // Calcula a força da senha
  const calculatePasswordStrength = () => {
    if (password.length === 0) {
      setPasswordStrength('média');
      return;
    }

    let strength = 0;
    
    // Comprimento da senha
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Variedade de caracteres
    if (useUppercase) strength += 1;
    if (useLowercase) strength += 1;
    if (useNumbers) strength += 1;
    if (useSymbols) strength += 2;

    // Determinar o nível de força
    if (strength <= 3) {
      setPasswordStrength('fraca');
    } else if (strength <= 5) {
      setPasswordStrength('média');
    } else {
      setPasswordStrength('forte');
    }
  };

  // Copia a senha para o clipboard
  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password)
        .then(() => {
          toast.success('Senha copiada para a área de transferência!');
        })
        .catch((err) => {
          toast.error('Erro ao copiar a senha');
          console.error('Erro ao copiar: ', err);
        });
    }
  };

  // Incrementa ou decrementa o comprimento da senha
  const adjustLength = (amount: number) => {
    const newLength = Math.max(4, Math.min(32, length + amount));
    setLength(newLength);
  };

  // Gera a senha inicial e recalcula a força quando as configurações mudam
  useEffect(() => {
    generatePassword();
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols]);

  useEffect(() => {
    calculatePasswordStrength();
  }, [password, useUppercase, useLowercase, useNumbers, useSymbols]);

  return (
    <div className="w-full max-w-md bg-gradient-to-b from-blue-800/30 to-blue-900/30 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-blue-500/30">
      {/* Header */}
      <div className="p-6 text-center border-b border-blue-600/30">
        <div className="flex justify-center mb-2">
          <div className="bg-blue-500/20 p-2 rounded-full">
            <LockIcon className="text-blue-400 h-6 w-6" />
          </div>
        </div>
        <h1 className="text-xl font-bold text-white mb-1">Gerador de senhas</h1>
        <p className="text-blue-200 text-sm">Gere instantaneamente uma senha aleatória e segura</p>
      </div>

      {/* Password Display */}
      <div className="p-6 bg-gradient-to-r from-blue-900/50 to-blue-800/50">
        <div className="relative">
          <div className="bg-blue-950 border border-blue-700 rounded-lg p-4 flex justify-between items-center">
            <div className="text-blue-100 font-mono text-lg break-all overflow-x-auto no-scrollbar">
              {password}
            </div>
            <div className="flex space-x-2 ml-3">
              <button 
                onClick={generatePassword} 
                className="p-2 rounded-md hover:bg-blue-800/50 text-blue-300 transition-colors"
                title="Gerar nova senha"
              >
                <RefreshCw size={18} />
              </button>
              <button 
                onClick={copyToClipboard} 
                className="p-2 rounded-md hover:bg-blue-800/50 text-blue-300 transition-colors"
                title="Copiar senha"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Settings */}
      <div className="p-6">
        <h2 className="text-lg font-medium text-white mb-4">Personalize sua senha</h2>
        
        {/* Character Length */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-blue-200 text-sm">Número de caracteres</label>
            <span className="text-blue-100 font-mono bg-blue-800/30 px-2 rounded-md">{length}</span>
          </div>
          <div className="flex items-center">
            <button 
              onClick={() => adjustLength(-1)} 
              className="bg-blue-700 hover:bg-blue-600 text-white w-10 h-10 rounded-l-md flex items-center justify-center transition-colors"
              disabled={length <= 4}
            >
              -
            </button>
            <div className="flex-grow h-10 bg-blue-900/50 flex items-center justify-center border-t border-b border-blue-700">
              <div className="w-full bg-blue-950 h-2 rounded-full mx-4">
                <div 
                  className="h-2 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" 
                  style={{ width: `${(length / 32) * 100}%` }}
                ></div>
              </div>
            </div>
            <button 
              onClick={() => adjustLength(1)} 
              className="bg-blue-700 hover:bg-blue-600 text-white w-10 h-10 rounded-r-md flex items-center justify-center transition-colors"
              disabled={length >= 32}
            >
              +
            </button>
          </div>
        </div>

        {/* Character Types */}
        <div className="mb-6">
          <label className="text-blue-200 text-sm block mb-2">Características da senha</label>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                id="uppercase"
                type="checkbox"
                checked={useUppercase}
                onChange={() => setUseUppercase(!useUppercase)}
                className="w-4 h-4 rounded border-blue-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-blue-900"
              />
              <label htmlFor="uppercase" className="ml-2 text-blue-100">Letras maiúsculas</label>
            </div>
            <div className="flex items-center">
              <input
                id="lowercase"
                type="checkbox"
                checked={useLowercase}
                onChange={() => setUseLowercase(!useLowercase)}
                className="w-4 h-4 rounded border-blue-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-blue-900"
              />
              <label htmlFor="lowercase" className="ml-2 text-blue-100">Letras minúsculas</label>
            </div>
            <div className="flex items-center">
              <input
                id="numbers"
                type="checkbox"
                checked={useNumbers}
                onChange={() => setUseNumbers(!useNumbers)}
                className="w-4 h-4 rounded border-blue-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-blue-900"
              />
              <label htmlFor="numbers" className="ml-2 text-blue-100">Números</label>
            </div>
            <div className="flex items-center">
              <input
                id="symbols"
                type="checkbox"
                checked={useSymbols}
                onChange={() => setUseSymbols(!useSymbols)}
                className="w-4 h-4 rounded border-blue-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-blue-900"
              />
              <label htmlFor="symbols" className="ml-2 text-blue-100">Símbolos</label>
            </div>
          </div>
        </div>

        {/* Password Strength */}
        <div>
          <label className="text-blue-200 text-sm block mb-2">Força da senha</label>
          <div className="bg-blue-950/50 p-3 rounded-md border border-blue-800/50 flex items-center">
            <div className="w-full">
              <div className="flex gap-1">
                <div 
                  className={`h-2 flex-1 rounded-full ${
                    passwordStrength === 'fraca' ? 'bg-red-500' : 
                    passwordStrength === 'média' ? 'bg-yellow-500' : 
                    'bg-green-500'
                  }`}
                ></div>
                <div 
                  className={`h-2 flex-1 rounded-full ${
                    passwordStrength === 'fraca' ? 'bg-red-900/30' : 
                    passwordStrength === 'média' ? 'bg-yellow-500' : 
                    'bg-green-500'
                  }`}
                ></div>
                <div 
                  className={`h-2 flex-1 rounded-full ${
                    passwordStrength === 'forte' ? 'bg-green-500' : 'bg-green-900/30'
                  }`}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className={`text-xs ${passwordStrength === 'fraca' ? 'text-red-400' : 'text-blue-400'}`}>Fraca</span>
                <span className={`text-xs ${passwordStrength === 'média' ? 'text-yellow-400' : 'text-blue-400'}`}>Média</span>
                <span className={`text-xs ${passwordStrength === 'forte' ? 'text-green-400' : 'text-blue-400'}`}>Forte</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with generate button */}
      <div className="px-6 pb-6 pt-2 flex justify-center">
        <button
          onClick={generatePassword}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          Gerar Nova Senha
        </button>
      </div>
    </div>
  );
};

export default PasswordGenerator;
