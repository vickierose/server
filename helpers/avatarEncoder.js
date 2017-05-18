function encodeAvatar( user ) {
    const avatar = () =>{
        if (avatar){
            return 'data:image/gif;base64,' + user.avatar.data.toString('base64')
        } else {return ''}
    };

    const resUser = {
        username: user.username,
        email: user.email,
        status: user.status,
        _id: user._id,
        avatar: avatar()
    };
    return resUser;
}

module.exports = encodeAvatar;