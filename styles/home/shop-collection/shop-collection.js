import {Dimensions, StyleSheet} from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
    view: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginHorizontal: 'auto',
        marginVertical: 0,
        paddingVertical: 40,
    },
    title: {
        fontSize: 40,
        paddingBottom: 20,
        fontFamily: 'Fraunces-Regular',
        textAlign: 'center',
        color: '#403F2B',
    },
    collections: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    carouselContainer: {
        position: 'relative',
        width: '100%',
        alignItems: 'center'
    },
    carousel: {
        flex: 1,
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: screenWidth * 0.6,
        height: screenWidth * 0.7,
        borderWidth: 10,
        borderColor: 'transparent',
    },
    carouselImage: {
        width: screenWidth * 0.6 - 20,
        height: screenWidth * 0.7,
        borderRadius: 15,
    },
    carouselTitle: {
        width: screenWidth * 0.6,
        textAlign: 'center',
        color: '#333',
        padding: 5,
        marginTop: 10,
        fontSize: 20,
    },
    carouselPrice: {
        width: screenWidth * 0.6,
        textAlign: 'center',
        color: '#333',
        padding: 5,
        fontSize: 14,
    },
    indicators: {
        position: 'absolute',
        top: 0,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        width: '100%',
        height: '100%',
        zIndex: -1,

    },
    indicatorButtonLeft: {
        position: 'absolute',
        top: '50%',
        left: 0,
        padding: 10,
        borderRadius: 5,
        transform: [{translateY: -30}],
    },
    indicatorButtonRight: {
        position: 'absolute',
        top: '50%',
        right: 0,
        padding: 10,
        borderRadius: 5,
        transform: [{translateY: -30}],
    },
    indicatorText: {
        fontSize: 18,
        color: '#333',
    },
});