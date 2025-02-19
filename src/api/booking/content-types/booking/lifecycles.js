'use strict';

module.exports = {
    async afterCreate(event){
        const {result} = event
        try {
            await strapi.entityService.update('api::booking.booking',result.id,{
                data: {
                    booking_id: result.id,
                }
            })
        }catch (error) {
            console.log('Error updating booking_id:', error)
        }
    }
}