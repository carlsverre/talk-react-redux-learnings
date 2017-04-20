import React, { Component } from 'react';
import { connect } from 'react-redux';

export default (options) => {
    const { onMount, onUpdate } = options;

    return (WrappedComponent) => {
        class LifecycleComponent extends Component {
            componentWillMount() {
                const { dispatch, ...props } = this.props;
                onMount(dispatch, props);
            }

            componentWillReceiveProps(nextProps) {
                const { dispatch, ...props } = this.props;
                onUpdate(dispatch, props, nextProps);
            }

            render() {
                return <WrappedComponent {...this.props} />;
            }
        }

        // provides dispatch - in React-Redux v5 we could create a version of
        // connect that also allows you to directly specify componentWillMount
        LifecycleComponent = connect()(LifecycleComponent);

        return LifecycleComponent;
    };
};
