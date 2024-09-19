const config = require('../config.json')

export const isAdmin = (user) => {  
    return user?.roles === config.Roles.Administrateur
}

export const isUser = (user) => {
    return user?.roles === config.Roles.Utilisateur
}