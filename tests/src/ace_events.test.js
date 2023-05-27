/**
 * @jest-environment jsdom
 */
import React from 'react'

import {create, act} from 'react-test-renderer';

import AceEditor from "../../src/ace";


test("should call the onChange method callback", () => {
  const onChangeCallback = jest.fn()
  const root = create(
    <AceEditor onChange={onChangeCallback} />
  );

  // Check is not previously called
  expect(onChangeCallback.mock.calls).toHaveLength(0);

  // Trigger the change event
  const expectText = "React Ace Test";
  root.getInstance().editor.setValue(expectText, 1);
  expect(onChangeCallback.mock.calls).toHaveLength(1);
  const call = onChangeCallback.mock.calls[0];

  expect(call[0]).toEqual(expectText);
  expect(call[1].action).toEqual("insert");  
});


test("should limit call to onChange (debounce)", done => {
  const period = 100;
  const onChangeCallback = jest.fn();
  const root = create(
    <AceEditor onChange={onChangeCallback} debounceChangePeriod={period} />
  );
  const editor = root.getInstance().editor;
  // Check is not previously called
  expect(onChangeCallback.mock.calls).toHaveLength(0);

  // Trigger the change event
  const expectText = "React Ace Test";
  const expectText2 = "React Ace Test2";
  editor.setValue(expectText, 1);
  editor.setValue(expectText2, 1);

  expect(onChangeCallback.mock.calls).toHaveLength(0);

  setTimeout(function () {
    expect(onChangeCallback.mock.calls).toHaveLength(1);
    let call = onChangeCallback.mock.calls[0];
    expect(call[0]).toEqual(expectText2);
    expect(call[1].action).toEqual("insert");
    onChangeCallback.mockReset();
    editor.setValue(expectText2, 1);
    editor.setValue(expectText, 1);
    expect(onChangeCallback.mock.calls).toHaveLength(0);
    setTimeout(function () {
      expect(onChangeCallback.mock.calls).toHaveLength(1);
      let call = onChangeCallback.mock.calls[0];
      expect(call[0]).toEqual(expectText);
      expect(call[1].action).toEqual("insert");
      done();
    }, 100);
  }, 100);
});


test("should call the onCopy method", () => {
  const onCopyCallback = jest.fn();
  const root = create(
    <AceEditor onCopy={onCopyCallback} />
  );

  // Check is not previously called
  expect(onCopyCallback.mock.calls).toHaveLength(0);

  // Trigger the copy event
  const expectText = "React Ace Test";
  root.getInstance().onCopy({ text: expectText });

  expect(onCopyCallback.mock.calls).toHaveLength(1);
  expect(onCopyCallback.mock.calls[0][0]).toEqual(expectText);
});

test("should call the onPaste method", () => {
  const onPasteCallback = jest.fn();
  const root = create(
    <AceEditor onPaste={onPasteCallback} />
  );

  // Check is not previously called
  expect(onPasteCallback.mock.calls).toHaveLength(0);

  // Trigger the Paste event
  const expectText = "React Ace Test";
  root.getInstance().onPaste({ text: expectText });

  expect(onPasteCallback.mock.calls).toHaveLength(1);
  expect(onPasteCallback.mock.calls[0][0]).toEqual(expectText);

});


test.skip.failing("should call the onFocus method callback", () => {
  const onFocusCallback = jest.fn();
  const root = create(
    <AceEditor onFocus={onFocusCallback} />
  );

  // Check is not previously called
  expect(onFocusCallback.mock.calls).toHaveLength(0);

  // Trigger the focus event
  root.getInstance().editor.focus();
  expect(onFocusCallback.mock.calls).toHaveLength(1);
  expect(onFocusCallback.mock.calls[0]).toHaveLength(1);
});

test("should call the onSelectionChange method callback", done => {
  let onSelectionChange = function () {};
  const value = `
        function main(value) {
          console.log('hi james')
          return value;
        }
      `;
  const root = create(<AceEditor value={value} />);
  
  onSelectionChange = function (selection) {
    const content = root
          .getInstance()
          .editor.session.getTextRange(selection.getRange());
    expect(content).toEqual(value);
    done();
  };
  act(() => {
    root.update(<AceEditor onSelectionChange={ onSelectionChange }/>);
  });
  root.getInstance().editor.getSession().selection.selectAll();
  
});

test("should call the onCursorChange method callback", done => {
  let onCursorChange = function () {};
  const value = `
        function main(value) {
          console.log('hi james')
          return value;
        }
      `;

  const root = create(<AceEditor value={value} />);
  onCursorChange = function (selection) {
    expect(selection.getCursor()).toMatchObject({ row: 0, column: 0 });
    done();
  };
  act(() => {
    root.update(<AceEditor onCursorChange = { onCursorChange }/>);
  });
  expect(
    root.getInstance().editor.getSession().selection.getCursor()
  ).toMatchObject({ row: 5, column: 6 });
  root.getInstance().editor.getSession().selection.moveCursorTo(0, 0);
});


test("should call the onBlur method callback", () => {
  const onBlurCallback = jest.fn();
  const root = create(
    <AceEditor onBlur={onBlurCallback} />
  );

  // Check is not previously called
  expect(onBlurCallback.mock.calls).toHaveLength(0);

  // Trigger the blur event
  root.getInstance().onBlur();

  expect(onBlurCallback.mock.calls).toHaveLength(1);
  expect(onBlurCallback.mock.calls[0]).toHaveLength(2);
});


test("should not trigger a component error to call the events without setting the props", () => {
  const root = create(<AceEditor />);
  const instance = root.getInstance();
  // Check the if statement is checking if the property is set.
  instance.onChange();
  instance.onCopy("copy");
  instance.onPaste("paste");
  instance.onFocus();
  instance.onBlur();
});
