const axios = require('axios');

exports.getFloorPrice = async (req_, res_) => {
    try {
        if (!req_.query.token_id)
            return res_.send({ result: false, error: 'failed' });
        const _tokenId = req_.query.token_id;
        // var config = {
        //   method: 'get',
        //   url: 'https://nftier.tech/advanced-analytics/hedera/0.0.1783975',
        // };

        var config = {
            method: 'get',
            url: `https://hedera-nft-backend.herokuapp.com/api/collectioninfo/${_tokenId}`,
            headers: {
                'origin': 'https://zuse.market'
            }
        };

        await axios(config)
            .then(function (res) {
                console.log(res);
                if (res.data === null || res.data === '')
                    return res_.send({ result: false, error: 'failed' });
                return res_.send({ result: true, data: res.data.collectionStats.floor });
            })
            .catch(function (error) {
                console.log(error);
                return false;
            });
        return true;
    } catch (error) {
        return false;
    }
}