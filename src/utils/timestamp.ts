import BigNumber from 'bignumber.js'

// getCurrentTimestamp and it will be =====> ((_currentTimeStamp % 86400) == 0)
export const getCurrentTimeSTamp = async () => {
    try {
        var currentTimeStamp = new Date();
        currentTimeStamp.toUTCString();
        var d2 = new Date( currentTimeStamp.getUTCFullYear(), currentTimeStamp.getUTCMonth(), currentTimeStamp.getUTCDate(), currentTimeStamp.getUTCHours(), currentTimeStamp.getUTCMinutes(), currentTimeStamp.getUTCSeconds() );
        d2.toUTCString();
        let _currentTimeStamp = Math.floor(d2.getTime() / 1000)
        if(currentTimeStamp.getTimezoneOffset() > 0) {
            _currentTimeStamp = _currentTimeStamp - (currentTimeStamp.getTimezoneOffset()*60)
        } 
        if(_currentTimeStamp % 86400 != 0) {
            const remainder = _currentTimeStamp % 86400
            _currentTimeStamp = _currentTimeStamp - remainder
        }
        return _currentTimeStamp
    } catch (error) {
        console.log('error: ', error)
    }
}