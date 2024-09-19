export const separateNumbersWithSpaces = (number) => {
    // Convert number to string
    let numStr = String(number);
    
    // Split the string into chunks of three digits from the end
    let chunks = [];
    for (let i = numStr.length; i > 0; i -= 3) {
        chunks.unshift(numStr.slice(Math.max(0, i - 3), i));
    }
    
    // Join the chunks with space and return
    return chunks.join(' ');
}