
//import { renderComponent } from '../react-dom/render';
import { renderComponent } from '../react-dom/diff';


class Component {
    constructor( props = {} ) {
        this.isReactComponent = true;

        this.state = {};
        this.props = props;
    }

    setState( stateChange ) {
        //assign 将stateChange对象覆盖到this.state中，返回新的this.state
        //Object.assign({}, obj)复制对象
        Object.assign( this.state, stateChange );
        renderComponent( this );
    }
}

export default Component;
