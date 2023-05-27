/**
 * @jest-environment jsdom
 */
import React from 'react'

import {create, act} from 'react-test-renderer';

import AceEditor from "../../src/ace";


test("should update the editorOptions on componentDidUpdate", () => {
  const options = {
    printMargin: 80
  };
  const root = create(<AceEditor setOptions={options} />);

  // Read set value
  const editor = root.getInstance().editor;
  expect(editor.getOption("printMargin")).toEqual(options.printMargin);

  // Now trigger the componentDidUpdate
  const newOptions = {
    printMargin: 200,
    animatedScroll: true
  };
  act(() => {
    root.update(<AceEditor setOptions={ newOptions }/>);
  });
  expect(editor.getOption("printMargin")).toEqual(newOptions.printMargin);
  expect(editor.getOption("animatedScroll")).toEqual(
    newOptions.animatedScroll
  );
});


test("should update the editorOptions on componentDidUpdate", () => {
  const root = create(<AceEditor minLines={1} />);
  
  // Read set value
  const editor = root.getInstance().editor;
  expect(editor.getOption("minLines")).toEqual(1);

  act(() => {
    root.update(<AceEditor minLines={2} />);
  });
  expect(editor.getOption("minLines")).toEqual(2);
});

describe("mode prop", () => {
  it("should update the mode on componentDidUpdate", () => {
    const root = create(<AceEditor mode="javascript" />);
    // Read set value
    const oldMode = root.getInstance().props["mode"];
    
    act(() => {
      root.update(<AceEditor mode="elixir"/>);
    });
    const newMode = root.getInstance().props["mode"];
    expect(oldMode).toEqual("javascript");
    expect(newMode).toEqual("elixir");
  });

  it("should accept an object mode", () => {
    const root = create(<AceEditor />);
    const session = root.getInstance().editor.getSession();
    const sessionSpy = jest.spyOn(session, "setMode").mockImplementation(
      () => {});

    const mode = {
      path: "ace/mode/javascript"
    };
    act(() => {
      root.update(<AceEditor mode={ mode }/>);
    });
    expect(sessionSpy.mock.lastCall).toEqual([mode]);
  });
});

test("should update many props on componentDidUpdate", () => {
  const root = create(
    <AceEditor
      theme="github"
      keyboardHandler="vim"
      fontSize={14}
      wrapEnabled={true}
      showPrintMargin={true}
      showGutter={false}
      height="100px"
      width="200px"
    />
  );

  // Read set value
  const oldProps = root.getInstance().props;

  act(() => {
    root.update(
      <AceEditor
	theme="solarized"
        keyboardHandler="emacs"
        fontSize={18}
	wrapEnabled={false}
	showPrintMargin={false}
	showGutter={true}
        height="120px"
        width="220px"
	/>
	)
  });

  const newProps = root.getInstance().props;


  const propNames = ["theme", "keyboardHandler", "fontSize", "wrapEnabled",
		     "showPrintMargin", "showGutter", "height", "width"];
  propNames.forEach(propName =>
    expect(oldProps[propName]).not.toEqual(newProps[propName]));
});


// Issue in ReactAce?
test.skip.failing("should update the className on componentDidUpdate", () => {
  const className = "old-class";
  const root = create(<AceEditor className={className} />);

  // Read set value
  let editor = root.getInstance().refEditor;
  expect(editor.className).toEqual(
    " ace_editor ace_hidpi ace-tm old-class"
  );

  // Now trigger the componentDidUpdate
  const newClassName = "new-class";
  act(() => {
    root.update(<AceEditor className={newClassName}/>);
  });
  editor = root.getInstance().refEditor;
  expect(editor.className).toEqual(
    " new-class ace_editor ace_hidpi ace-tm"
  );
});


test("should update the value on componentDidUpdate", () => {
  const startValue = "start value";
  const root = create(<AceEditor value={startValue} />);
  
  // Read set value
  let editor = root.getInstance().editor;
  expect(editor.getValue()).toEqual(startValue);
  
  // Now trigger the componentDidUpdate
  const newValue = "updated value";
  act(() => {
    root.update(<AceEditor value={newValue}/>);
  });
  editor = root.getInstance().editor;
  expect(editor.getValue()).toEqual(newValue);
});


test.skip.failing("should trigger the focus on componentDidUpdate", done => {
  const onFocusCallback = jest.fn(() => done());
  const root = create(
    <AceEditor onFocus={onFocusCallback} />
  );

  // Read the focus
  expect(onFocusCallback.mock.calls).toHaveLength(0);
  
  // Now trigger the componentDidUpdate
  act(() => {
    root.update(<AceEditor focus={ true }/>);
  });
});
