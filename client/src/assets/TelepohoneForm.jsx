import React from "react";

// La fonction de formatage reste bien cachée à l'intérieur du fichier du composant
const formatTelephone = (value) => {
    if (!value) return value;
    const digits = value.replace(/[^\d]/g, '').slice(0, 10);
    if (digits.length < 4) return digits;
    if (digits.length < 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export function InputTelephone({ value, onChange, label = "Numéro de téléphone", name = "telephone", required = false }) {
    
    const handleInputChange = (e) => {
        // 1. On applique le formatage en direct sur la valeur saisie
        const formattedValue = formatTelephone(e.target.value);
        
        // 2. On recrée un faux événement target pour que ton handleChange d'origine reçoive la bonne valeur
        onChange({
            target: {
                name: name,
                value: formattedValue
            }
        });
    };

    return (
        <div className="field">
            <label className="label">{label}</label>
            <div className="control">
                <input 
                    className="input" 
                    type="text" 
                    name={name}
                    placeholder="000-000-0000"
                    value={value} 
                    onChange={handleInputChange} 
                    maxLength={12} // 10 chiffres + 2 tirets
                    required={required} 
                />
            </div>
        </div>
    );
}