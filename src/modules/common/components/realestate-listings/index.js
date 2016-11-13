import Styles from "!css?modules!sass!./style.scss";
import Template from "./index.html";
import { Component, on } from "marionette.component";

/**
 * Entry point for realestate-listings
 */
class RealEstateListingsComponent extends Component {

    /**
     * Setup our component.
     */
    constructor (elementName, props) {
        super(elementName);
        this.render(elementName, props);
        this.properties = props;

        return this;
    }

    update (properties) {
        let data = {
            properties: properties
        };

        this.properties = properties;

        const renderedTemplate = _.template(Template)(data);
        this.element.updateElement(renderedTemplate, Styles);
    }

    render (elementName, props) {
        let that = this;
        let data = {
            properties: props
        };

        const renderedTemplate = _.template(Template)(data);

        this.renderComponent(elementName, renderedTemplate, Styles);
    }

    /**
     * When the user clicks the element, console log "hello" and the click event.
     *
     * @param event {Event} The click event.
     */
    @on("click button")
    onUserClick (event) {
        console.log(event);
    }
}

/**
 *  Export the Component
 *
 * @exports DemoComponent
 */
export default RealEstateListingsComponent;