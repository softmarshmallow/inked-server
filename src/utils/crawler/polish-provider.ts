const mapping = require('./ebest-provider-mapping.json');
function polishProvider(provider: string): string {
    try {
        const mapped = mapping[provider];
        if (mapped == undefined){
            return provider;
        }
        return mapped;
    }catch (e) {
        return "UNKNOWN";
    }
}



export {
    polishProvider
}
