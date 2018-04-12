// import { Componet } from '../react';
// import { setAttribute } from './dom';

// function createComponent( component, props ) {

//     let inst;

//     if ( component.prototype && component.prototype.render ) {
// 		inst = new component( props );
// 	} else {
// 		inst = new Component( props );
// 		inst.constructor = component;
// 		inst.render = function() {
//             return this.constructor( props );
//         };
// 	}

//     return inst;
// }


// function unmountComponent( component ) {
//     if ( component.componentWillUnmount ) component.componentWillUnmount();
//     removeNode( component.base);
// }

// function setComponentProps( component, props ) {

//     if ( !component.base ) {
// 		if ( component.componentWillMount ) component.componentWillMount();
// 	} else if ( component.componentWillReceiveProps ) {
// 		component.componentWillReceiveProps( props );
// 	}

//     component.props = props;

//     renderComponent( component );

// }

// export function renderComponent( component ) {

//     let base;

//     const renderer = component.render();

//     if ( component.base && component.componentWillUpdate ) {
//         component.componentWillUpdate();
//     }

//     base = _render( renderer );

//     if ( component.base ) {
//         if ( component.componentDidUpdate ) component.componentDidUpdate();
//     } else if ( component.componentDidMount ) {
//         component.componentDidMount();
//     }

//     if ( component.base && component.base.parentNode ) {
//         component.base.parentNode.replaceChild( base, component.base );
//     }

//     component.base = base;
//     base._component = component;

// }

// function _render( vnode ) {

//     if ( vnode === undefined || vnode === null || typeof vnode === 'boolean' ) vnode = '';

//     if ( typeof vnode === 'number' ) vnode = String( vnode );

//     if ( typeof vnode === 'string' ) {
//         let textNode = document.createTextNode( vnode );
//         return textNode;
//     }

//     if ( typeof vnode.tag === 'function' ) {

//         const component = createComponent( vnode.tag, vnode.attrs );

//         setComponentProps( component, vnode.attrs );

//         return component.base;
//     }

//     const dom = document.createElement( vnode.tag );

//     if ( vnode.attrs ) {
//         Object.keys( vnode.attrs ).forEach( key => {

//             const value = vnode.attrs[ key ];

//             setAttribute( dom, key, value );

//         } );
//     }

//     if ( vnode.children ) {
//         vnode.children.forEach( child => render( child, dom ) );
//     }

//     return dom;
// }

// export function render( vnode, container ) {
//     return container.appendChild( _render( vnode ) );
// }

//
import { diff } from './diff.js';

function _render( vnode, container ) {

    if ( vnode === undefined ) return;

    if ( vnode.isReactComponent ) {
        const component = vnode;

        if ( component._container ) {
            if ( component.componentWillUpdate ) {
                component.componentWillUpdate();
            }
        } else if ( component.componentWillMount ) {
            component.componentWillMount();
        }

        component._container = container;   // 保存父容器信息，用于更新

        vnode = component.render();
    }

    if ( typeof vnode === 'string' || typeof vnode === 'number' ) {
        let textNode = document.createTextNode( vnode );
        return container.appendChild( textNode );
    }

    const dom = document.createElement( vnode.tag );

    if ( vnode.attrs ) {
        Object.keys( vnode.attrs ).forEach( key => {

            const value = vnode.attrs[ key ];

            if ( key === 'className' ) key = 'class';

            // 如果是事件监听函数，则直接附加到dom上
            if ( typeof value === 'function' ) {
                dom[ key.toLowerCase() ] = value;
            } else {
                dom.setAttribute( key, vnode.attrs[ key ] );
            }

        } );
    }

    if ( vnode.children ) {
        vnode.children.forEach( child => _render( child, dom ) );
    }

    return container.appendChild( dom );
}

function render( vnode, container, dom ) {
    return diff( dom, vnode, container );
}

export default render;