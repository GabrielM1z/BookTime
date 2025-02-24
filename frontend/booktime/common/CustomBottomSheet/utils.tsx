export const generateRandomKey = () => {
    return `key_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
};