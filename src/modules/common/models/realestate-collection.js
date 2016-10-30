import Backbone from "backbone";

const RealEstateModel = Backbone.Model.extend ({

    /**
     * The URL we'll use to send a request to the real estate servers for their listings.
     *
     * @returns {string} The URL of which we'll be pinging.
     */
    urlRoot () {
        return "https://services.realestate.com.au/services/listings/search";
    },

    /**
     * Response will be;
     *
     * _links               {Object}
     * channel              {String}
     * prettyUrl            {String}
     * resolvedLocalities   {Object}
     * resolvedQuery        {Object}
     * tieredResults        {Object}
     * totalResultsCount    {Number}
     */
    /**
     *
     * @param response {Object}
     */
    parse (response) {
        return {
            results: response.tieredResults[0].results,
            channel: response.channel
        };
    }

});

export default RealEstateModel;