import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bolaAzulGrande: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#6EBBEB',
        position: 'absolute',
        top: -90,
        left: 90,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        
    },
    textoLogin: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6EBBEB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageTasks: {
        width: 200,
        height: 200,
    },
})

export default style;