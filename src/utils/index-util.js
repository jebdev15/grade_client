export const AuthUtil = {
    checkToken: (token) => {
        const { isValid } = token.data
        if(!isValid) {
            return '/'
        }
        const { isAdmin } = token.data
        return isAdmin ? '/admin' : '/home'
    }
}