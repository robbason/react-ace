/**
 * @jest-environment jsdom
 */

import React from 'react'
import {render, screen} from '@testing-library/react'
import {create, act} from 'react-test-renderer';

import AceEditor from "../../src/ace";
// import 'ace-builds/webpack-resolver';

test("should render without problems with defaults properties", () => {
  render(<AceEditor />);
  expect(screen.getByRole('textbox')).toBeDefined();
});


test("should trigger console warn if editorOption is called", () => {
  const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
  render(<AceEditor enableBasicAutocompletion={true} />);
  expect(warn).toBeCalledWith(
      "ReactAce: editor option enableBasicAutocompletion was activated but not found. Did you need to import a related tool or did you possibly mispell the option?"
  );
  warn.mockReset();
});


test("should render without problems with defaults properties, defaultValue and keyboardHandler", () => {
  const hijames = "hi, james";
  const root =create(
    <AceEditor keyboardHandler="vim" defaultValue={hijames} />,
  );

  let editor = root.getInstance().editor;
  expect(editor.getValue()).toEqual(hijames);
});


test("should render editor options not default values", () => {
  const root =create(
    <AceEditor
      keyboardHandler="vim"
      setOptions={{
        tabSize: 2
      }}
      defaultValue="hi james"
    />
  );
  let editor = root.getInstance().editor;
  expect(editor.getOption("tabSize")).toEqual(2);
});


test("should get the ace library from the onBeforeLoad callback", () => {
  const beforeLoadCallback = jest.fn();
  render(<AceEditor onBeforeLoad={beforeLoadCallback} />);
  expect(beforeLoadCallback.mock.calls).toHaveLength(1);
});

// test hangs??
test("should get the editor from the onLoad callback", () => {
  const loadCallback = jest.fn();
  const root = create(<AceEditor onLoad={loadCallback} />);
  const editor = root.getInstance().editor;
  expect(loadCallback.mock.calls).toHaveLength(1);
  expect(loadCallback.mock.calls[0][0]).toEqual(editor);
});


test("should set the editor props to the Ace element", () => {
  const editorProperties = {
    react: "setFromReact",
    test: "setFromTest"
  };
  const root = create(
    <AceEditor editorProps={editorProperties} />
  );

  const editor = root.getInstance().editor;
  
  expect(editor.react).toEqual(editorProperties.react);
  expect(editor.test).toEqual(editorProperties.test);
});



test("should set the command for the Ace element", () => {
  const commandsMock = [
    {
      name: "myReactAceTest",
      bindKey: { win: "Ctrl-M", mac: "Command-M" },
      exec: () => {},
      readOnly: true
    },
    {
      name: "myTestCommand",
      bindKey: { win: "Ctrl-W", mac: "Command-W" },
      exec: () => {},
      readOnly: true
    }
  ];

  const root = create(
    <AceEditor commands={commandsMock} />
  );
  const editor = root.getInstance().editor;

  expect(editor.commands.commands.myReactAceTest).toMatchObject(
    commandsMock[0]
  );
  expect(editor.commands.commands.myTestCommand).toMatchObject(
    commandsMock[1]
  );
});


test("should change the command binding for the Ace element", () => {
  const commandsMock = [
    {
      bindKey: { win: "ctrl-d", mac: "command-d" },
      name: "selectMoreAfter",
      exec: "selectMoreAfter"
    }
  ];
  const root = create(
    <AceEditor commands={commandsMock} />
  );
  const editor = root.getInstance().editor;

  const expected = [editor.commands.commands.removeline, "selectMoreAfter"];
  expect(editor.commands.commandKeyBinding["ctrl-d"]).toMatchObject(
    expected
  );
});


test("should set up the placeholder text with no value set", () => {
  const placeholder = "Placeholder Text Here";

  const root = create(
    <AceEditor placeholder={placeholder} />
  );

  // Read the markers
  const editor = root.getInstance().editor;

  expect(editor.renderer.placeholderNode).toBeTruthy();
  expect(editor.renderer.placeholderNode.textContent).toEqual(placeholder);
});

test("should not set up the placeholder text with value set", () => {
  const placeholder = "Placeholder Text Here";
  const root = create(
    <AceEditor placeholder={placeholder} value="Code here" />,
  );
  const editor = root.getInstance().editor;

  expect(editor.renderer.placeholderNode).toBeUndefined();
});



test("should set up the markers", () => {
  const markers = [
    {
      startRow: 3,
      type: "text",
      className: "test-marker"
    }
  ];
  const root = create(<AceEditor markers={markers} />);

  // Read the markers
  const editor = root.getInstance().editor;

  expect(editor.getSession().getMarkers()["3"].clazz).toEqual(
    "test-marker"
  );
  expect(editor.getSession().getMarkers()["3"].type).toEqual("text");
});


test("should update the markers", () => {
  const oldMarkers = [
    {
      startRow: 4,
      type: "text",
      className: "test-marker-old"
    },
    {
      startRow: 7,
      inFront: true,
      type: "foo",
      className: "test-marker-old"
    }
  ];
  const markers = [
    {
      startRow: 3,
      type: "text",
      className: "test-marker-new",
      inFront: true
    },
    {
      startRow: 5,
      type: "text",
      className: "test-marker-new"
    }
  ];

  const root = create(<AceEditor markers={oldMarkers} />);
  const editor = root.getInstance().editor;

  // Read the markers

  expect(editor.getSession().getMarkers()["3"].clazz).toEqual(
    "test-marker-old"
  );
  expect(editor.getSession().getMarkers()["3"].type).toEqual("text");

  act(() => {
    root.update(<AceEditor markers={markers}/>);
  })
  const editorB = root.getInstance().editor;

  expect(editorB.getSession().getMarkers()["6"].clazz).toEqual(
    "test-marker-new"
  );
  expect(editorB.getSession().getMarkers()["6"].type).toEqual("text");
});


test("should clear the markers", () => {
  const oldMarkers = [
    {
      startRow: 4,
      type: "text",
      className: "test-marker-old"
    },
    {
      startRow: 7,
      type: "foo",
      className: "test-marker-old",
      inFront: true
    }
  ];
  const markers = [];
  const root = create(<AceEditor markers={oldMarkers} />);

  // Read the markers
  const editor = root.getInstance().editor;
  expect(Object.keys(editor.getSession().getMarkers())).toMatchObject([
    "1",
    "2",
    "3"
  ]);
  expect(editor.getSession().getMarkers()["3"].clazz).toEqual(
    "test-marker-old"
  );
  expect(editor.getSession().getMarkers()["3"].type).toEqual("text");

  act(() => {
    root.update(<AceEditor markers={markers }/>);
  });
  const editorB = root.getInstance().editor;

  expect(Object.keys(editorB.getSession().getMarkers())).toMatchObject([
    "1",
    "2"
  ]);
});


test("should not remove active line and selected word highlight when clearing markers", () => {
  const newMarkers = [
    {
      startRow: 4,
      type: "text",
      className: "test-marker"
    }
  ];
  const root = create(
    <AceEditor highlightActiveLine markers={[]} />
  );

  const editor = root.getInstance().editor;
  const bgMarkers = editor.getSession().getMarkers(false);
  expect(Object.keys(bgMarkers)).toMatchObject(["1", "2"]);
  expect(bgMarkers["1"]).toHaveProperty("clazz", "ace_active-line");
  expect(bgMarkers["2"]).toHaveProperty("clazz", "ace_selected-word");

  act(() => {
    root.update(<AceEditor markers={newMarkers }/>);
  });
  const bgMarkersNew = editor.getSession().getMarkers(false);
  expect(Object.keys(bgMarkersNew)).toMatchObject(["1", "2", "3"]);
  expect(bgMarkersNew["1"]).toHaveProperty("clazz", "ace_active-line");
  expect(bgMarkersNew["2"]).toHaveProperty("clazz", "ace_selected-word");
  expect(bgMarkersNew["3"]).toHaveProperty("clazz", "test-marker");
});

test("should add annotations and clear them", () => {
  const annotations = [
    {
      row: 3, // must be 0 based
      column: 4, // must be 0 based
      text: "error.message", // text to show in tooltip
      type: "error"
    }
  ];
  const root = create(<AceEditor />);
  const editor = root.getInstance().editor;
  act(() => { root.update(<AceEditor annotations={annotations}/>);});
  expect(editor.getSession().getAnnotations()).toEqual(annotations);
  act(() => { root.update(<AceEditor annotations={null}/>);});
  expect(editor.getSession().getAnnotations()).toEqual([]);
});


test("should add annotations with changing editor value", () => {
  // See https://github.com/securingsincity/react-ace/issues/300
  const annotations = [
    { row: 0, column: 0, text: "error.message", type: "error" }
  ];
  const initialText = `Initial
      text`;
  const modifiedText = `Modified
      text`;
  const root = create(
    <AceEditor annotations={[]} value={initialText} />
  );
  const editor = root.getInstance().editor;
  act(() => {
    root.update(
      <AceEditor
	annotations={annotations}
        value={modifiedText}
      />)
  });
  expect(editor.renderer.$gutterLayer.$annotations).toHaveLength(1);
  expect(editor.renderer.$gutterLayer.$annotations[0]).toHaveProperty(
    "className"
  );
});


test.skip.failing("should keep annotations with changing editor value", () => {
  // See https://github.com/securingsincity/react-ace/issues/300
  const annotations = [
    { row: 0, column: 0, text: "error.message", type: "error" }
  ];
  const initialText = `Initial
      text`;
  const modifiedText = `Modified
      text`;
  const root = create(
    <AceEditor annotations={annotations} value={initialText} />
  );
  const editor = root.getInstance().editor;
  expect(editor.renderer.$gutterLayer.$annotations).toHaveLength(1);
  act(() => {
    root.update(<AceEditor value={modifiedText}/>)
  });
  expect(editor.renderer.$gutterLayer.$annotations).toHaveLength(1);
  expect(editor.renderer.$gutterLayer.$annotations[0]).toHaveProperty(
    "className"
  );
});


test("should set editor to null on componentWillUnmount", () => {
  const root = create(<AceEditor />);
  expect(root.getInstance().editor).toBeTruthy();

  // Check the editor is null after the Unmount
  root.unmount();
  expect(root.getInstance()).toBeNull();
  //expect(wrapper.get(0)).to.not.exist;
});
