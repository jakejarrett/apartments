import App from "app/app";
import { View } from "marionette";
import NavigationView from "modules/common/views/navigation/navigation";
import {attribute, className, tagName, template, on, modelEvents} from "modules/common/controllers/decorators";
import RealEstateModel from "modules/common/models/realestate-collection";
import RealEstateListingsComponent from "modules/common/components/realestate-listings";
import Template from "./home.html";
import "./home.scss";

/**
 * Home view
 *
 * @module modules/pages/home
 * @exports HomeView
 */
@className("home")
@template(Template, {})
@attribute("components", {})
@attribute("componentChannels", {})
@modelEvents("sync", "updateView")
class HomeView extends View {

    templateContext () {
        const that = this;

        return {
            results: that.model.get("results"),
            channel: that.model.get("channel")
        }
    }

    /**
     * When the template of the page has been updated, re render the template
     * (This won't preserve state)
     */
    initialize () {
        let that = this;
        let Navigation = new NavigationView();
        App.getNavigationContainer().show(Navigation);
        Navigation.setItemAsActive("home");

        let query = {
            channel: "rent",
            filters: {
                surroundingSuburbs: true,
                excludeTier2: true,
                geoPrecision: "address",
                excludeAddressHidden: "true",
                localities: [
                    {
                        searchLocation: "Melbourne, VIC 3000"
                    },
                    {
                        searchLocation: "Brunswick, VIC 3056"
                    },
                    {
                        searchLocation: "Richmond, VIC 3121"
                    }
                ]
            },
            pageSize: 20
        };

        this.model = new RealEstateModel();
        this.fetch(query);
    }

    onRender () {
        this.setupComponents();
    }

    /**
     * We don't want a full re-render when the model is updated
     *
     * @protected
     */
    updateView () {
        this.setupComponents();
    }

    setupComponents () {
        let $componentContainer = this.$el.find("#component-container");
        let results = this.model.get("results");

        if(undefined === results) return;


        this.registerComponent(`realestate-result`, RealEstateListingsComponent, $componentContainer, results);

        this.components["realestate-result"].module.update(results)
    }

    /**
     * Register the component.
     *
     * @param componentName {String} Name the component will be registered under.
     * @param component {HTMLElement} The component you're registering.
     * @param el {jQuery} Container/Element you're putting the component into.
     * @param properties {Object} Properties you wish to apply to the component.
     */
    registerComponent (componentName, component, el, properties) {
        let Component = App.Compontents;
        Component.register(componentName, component, properties);

        let componentObject = Component.getComponent(componentName);

        /** Store references to the component & radio channels **/
        this.components[componentObject.elementName] = {
            element: componentObject.component,
            module: componentObject.componentModule
        };

        this.componentChannels[componentObject.elementName] = componentObject.radioChannel || {};

        el.append(componentObject.component);
    }

    fetch (data) {
        let strQuery = JSON.stringify(data);

        this.model.fetch({
            data: { query: strQuery }
        });
    }

    @on("change [name='suburb']")
    onChangeSuburb (event) {
        event.preventDefault();
        let val = event.currentTarget.value;


        let query = {
            channel: "rent",
            filters: {
                surroundingSuburbs: true,
                excludeTier2: true,
                geoPrecision: "address",
                excludeAddressHidden: "true",
                localities: [
                    {
                        searchLocation: val
                    }
                ]
            },
            pageSize: 20
        };

        this.fetch(query);


    }
}

export default HomeView;