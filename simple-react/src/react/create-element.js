import Component from './component.js';

/**
 * 
 * 
 * @param {any} tag  标签
 * @param {any} attrs  属性
 * @param {any} children  子元素
 * @returns 
 */
function createElement( tag, attrs, ...children ) {
    attrs = attrs || {};
    return {
        tag,
        attrs,
        children,
        key: attrs.key || null
    };
}

export default createElement;
