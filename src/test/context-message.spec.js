import React, {cloneElement} from 'react';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';
import {
    ContextInfoMessage,
    ContextTipMessage,
} from '../';
import Base from '../base';
import InfoCircleIcon from 'ffe-icons-react/info-sirkel-ikon';


describe('Test Base', () => {
    let wrapper;
    let element;

    beforeEach(() => {
        element =
            <Base
                messageType='tip'
                icon={<InfoCircleIcon />}
            >
                <p>content</p>
            </Base>;
        wrapper = mount(
            element
        )
    });

    it('renders with provided content', () => {
        const content = wrapper.find('.ffe-context-message__content').find('p');
        expect(content.length).to.be(1);
        expect(content.text()).to.be('content');
    });

    it('renders with provided header', () => {
        const header = 'header';
        wrapper = mount(cloneElement(element, {header}));
        const headerText = wrapper.find('.ffe-context-message__content').find('header');
        expect(headerText.length).to.be(1);
        expect(headerText.text()).to.be(header);
    });

    it('renders provided styles to outermost container', () => {
        const component = shallow(cloneElement(element, {style: {marginTop: '40px'}}));
        expect(component.props().style.marginTop).to.be('40px');
    });

    it('closes itself after a click on the close button', done => {
        const onClickSpy = sinon.spy();
        wrapper = mount(cloneElement(element, {onClosed: onClickSpy}));
        wrapper.find('.ffe-context-message__close-button').simulate('click');
        setTimeout(() => {
            const component = wrapper.find('.ffe-context-message-wrapper');
            expect(component.get(0).style.getPropertyValue('height')).to.be('0px');
            expect(onClickSpy.calledOnce);
            done();
        }, 100);
    });
});

describe('Test ContextInfoMessage', () => {
    const wrapper = mount(
        <ContextInfoMessage
            icon={<InfoCircleIcon />}
        >
            <p>content</p>
        </ContextInfoMessage>
    );

    it('creates ContextInfoMessage', () => {
        const component = wrapper.find('.ffe-context-message-wrapper');
        expect(component.hasClass('ffe-context-message-wrapper--info')).to.be(true);
    });
});

describe('Test ContextTipMessage', () => {
    const wrapper = mount(
        <ContextTipMessage
            icon={<InfoCircleIcon />}
        >
            <p>content</p>
        </ContextTipMessage>
    );

    it('creates ContextInfoMessage', () => {
        const component = wrapper.find('.ffe-context-message-wrapper');
        expect(component.hasClass('ffe-context-message-wrapper--tip')).to.be(true);
    });
});
