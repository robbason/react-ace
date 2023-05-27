/**
 * @jest-environment jsdom
 */
import React from 'react'

import {create, act} from 'react-test-renderer';

import SplitEditor from "../../src/split";


describe("Split Component", () => {

  describe("General", () => {
    it("should render without problems with defaults properties", () => {
      const root = create(<SplitEditor />);
      expect(root).toBeTruthy();
    });
    it("should get the ace library from the onBeforeLoad callback", () => {
      const beforeLoadCallback = jest.fn();
      create(<SplitEditor onBeforeLoad={beforeLoadCallback} />);

      expect(beforeLoadCallback.mock.calls).toHaveLength(1);
    });

    it("should trigger console warn if editorOption is called", () => {
      const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

      const root = create(
        <SplitEditor enableBasicAutocompletion={true} />
      );
      expect(root).toBeTruthy();
      expect(warn).toBeCalledWith(
          "ReaceAce: editor option enableBasicAutocompletion was activated but not found. Did you need to import a related tool or did you possibly mispell the option?"
      );
      warn.mockReset();
    });

    it("should set the editor props to the Ace element", () => {
      const editorProperties = {
        react: "setFromReact",
        test: "setFromTest"
      };
      const root = create(
        <SplitEditor editorProps={editorProperties} />
      );

      const editor = root.getInstance().splitEditor;

      expect(editor.react).toEqual(editorProperties.react);
      expect(editor.test).toEqual(editorProperties.test);
    });

    it("should update the orientation on componentDidUpdate", () => {
      let orientation = "below";
      const root = create(
        <SplitEditor orientation={orientation} splits={2} />
      );

      // Read set value
      let editor = root.getInstance().split;
      expect(editor.getOrientation()).toEqual(editor.BELOW);

      // Now trigger the componentDidUpdate
      orientation = "beside";

      act(() => {
	root.update(<SplitEditor orientation={orientation}/>)
      });
      editor = root.getInstance().split;
      expect(editor.getOrientation()).toEqual(editor.BESIDE);
    });

    it("should update the orientation on componentDidUpdate", () => {
      const root = create(<SplitEditor splits={2} />);

      // Read set value
      let editor = root.getInstance().split;
      expect(editor.getSplits()).toEqual(2);

      // Now trigger the componentDidUpdate

      act(() => {
	root.update(<SplitEditor splits={4}/>)
      });
      editor = root.getInstance().split;
      expect(editor.getSplits()).toEqual(4);
    });

    it("should set the command for the Ace element", () => {
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
        <SplitEditor commands={commandsMock} />
      );

      const editor = root.getInstance().splitEditor;
      expect(editor.commands.commands.myReactAceTest).toMatchObject(
        commandsMock[0]
      );
      expect(editor.commands.commands.myTestCommand).toMatchObject(
        commandsMock[1]
      );
    });

    it("should change the command binding for the Ace element", () => {
      const commandsMock = [
        {
          bindKey: { win: "ctrl-d", mac: "command-d" },
          name: "selectMoreAfter",
          exec: "selectMoreAfter"
        }
      ];
      const root = create(
        <SplitEditor commands={commandsMock} />
      );

      const editor = root.getInstance().splitEditor;
      const expected = [editor.commands.commands.removeline, "selectMoreAfter"];
      expect(editor.commands.commandKeyBinding["ctrl-d"]).toMatchObject(
        expected
      );
    });

    it.skip.failing("should get the editor from the onLoad callback", () => {
      const loadCallback = jest.fn();
      const root = create(
        <SplitEditor onLoad={loadCallback} />
      );

      // Get the editor
      const editor = root.getInstance().split;

      expect(loadCallback.mock.calls).toHaveLength(1);
      // Hangs - skipping
      expect(loadCallback.mock.lastCall).toMatchObject([editor]);
    });

    it.skip("should trigger the focus on mount", () => {
      const onFocusCallback = jest.fn();
      create(
        <SplitEditor focus={true} onFocus={onFocusCallback} />
      );

      // Read the focus
      expect(onFocusCallback.mock.calls).toHaveLength(1);
    });

    it("should set editor to null on componentWillUnmount", () => {
      const root = create(<SplitEditor />);
      expect(root.getInstance().editor).not.toBeNull();

      // Check the editor is null after the Unmount
      root.unmount();
      expect(root.getInstance()).toBeNull();
    });
  });

  describe("Events", () => {
    it("should call the onChange method callback", () => {
      const onChangeCallback = jest.fn();
      const root = create(
        <SplitEditor onChange={onChangeCallback} />
      );

      // Check is not previously called
      expect(onChangeCallback.mock.calls).toHaveLength(0);

      // Trigger the change event
      const expectText = "React Ace Test";
      root.getInstance().splitEditor.setValue(expectText, 1);

      expect(onChangeCallback.mock.calls).toHaveLength(1);
      expect(onChangeCallback.mock.lastCall[0]).toMatchObject([
        expectText,
        ""
      ]);
      expect(onChangeCallback.mock.lastCall[1].action).toEqual("insert");
    });

    it("should call the onCopy method", () => {
      const onCopyCallback = jest.fn();
      const root = create(
        <SplitEditor onCopy={onCopyCallback} />
      );

      // Check is not previously called
      expect(onCopyCallback.mock.calls).toHaveLength(0);

      // Trigger the copy event
      const expectText = "React Ace Test";
      root.getInstance().onCopy(expectText);

      expect(onCopyCallback.mock.calls).toHaveLength(1);
      expect(onCopyCallback.mock.lastCall[0]).toEqual(expectText);
    });

    it("should call the onPaste method", () => {
      const onPasteCallback = jest.fn();
      const root = create(
        <SplitEditor onPaste={onPasteCallback} />
      );

      // Check is not previously called
      expect(onPasteCallback.mock.calls).toHaveLength(0);

      // Trigger the Paste event
      const expectText = "React Ace Test";
      root.getInstance().onPaste(expectText);

      expect(onPasteCallback.mock.calls).toHaveLength(1);
      expect(onPasteCallback.mock.lastCall[0]).toEqual(expectText);
    });

    it.skip("should call the onFocus method callback", () => {
      const onFocusCallback = jest.fn();
      const root = create(
        <SplitEditor onFocus={onFocusCallback} />
      );

      // Check is not previously called
      expect(onFocusCallback.mock.calls).toHaveLength(0);

      // Trigger the focus event
      root.getInstance().split.focus();

      expect(onFocusCallback.mock.calls).toHaveLength(1);
    });

    it("should call the onSelectionChange method callback", () => {
      const onSelectionChangeCallback = jest.fn();
      const root = create(
        <SplitEditor
          onSelectionChange={onSelectionChangeCallback}
          value="some value"
        />
      );

      // Check is not previously called
      expect(onSelectionChangeCallback.mock.calls).toHaveLength(0);

      // Trigger the focus event
      root.getInstance().splitEditor.getSession().selection.selectAll();

      expect(onSelectionChangeCallback.mock.calls).toHaveLength(1);
    });

    it("should call the onCursorChange method callback", () => {
      const onCursorChangeCallback = jest.fn();

      const root = create(
        <SplitEditor value="a" onCursorChange={onCursorChangeCallback} />
      );

      // The changeCursor event is called when the initial value is set
      expect(onCursorChangeCallback.mock.calls).toHaveLength(1);

      // Trigger the changeCursor event
      root.getInstance().splitEditor.getSession().selection.moveCursorTo(0, 0);

      expect(onCursorChangeCallback.mock.calls).toHaveLength(2);
    });

    it("should call the onBlur method callback", () => {
      const onBlurCallback = jest.fn();
      const root = create(
        <SplitEditor onBlur={onBlurCallback} />
      );

      // Check is not previously called
      expect(onBlurCallback.mock.calls).toHaveLength(0);

      // Trigger the blur event
      root.getInstance().onBlur();

      expect(onBlurCallback.mock.calls).toHaveLength(1);
    });

    it("should not trigger a component error to call the events without setting the props", () => {
      const root = create(<SplitEditor />);

      // Check the if statement is checking if the property is set.
      root.getInstance().onChange();
      root.getInstance().onCopy("copy");
      root.getInstance().onPaste("paste");
      root.getInstance().onFocus();
      root.getInstance().onBlur();
    });
  });
  describe("ComponentDidUpdate", () => {
    it("should update the editorOptions on componentDidUpdate", () => {
      const options = {
        printMargin: 80
      };
      const root = create(<SplitEditor setOptions={options} />);

      // Read set value
      const editor = root.getInstance().splitEditor;
      expect(editor.getOption("printMargin")).toEqual(options.printMargin);

      // Now trigger the componentDidUpdate
      const newOptions = {
        printMargin: 200,
        animatedScroll: true
      };
      act(() => {
	root.update(<SplitEditor setOptions={newOptions}/>)
      });

      expect(editor.getOption("printMargin")).toEqual(newOptions.printMargin);
      expect(editor.getOption("animatedScroll")).toEqual(
        newOptions.animatedScroll
      );
    });
    it("should update the editorOptions on componentDidUpdate", () => {
      const root = create(<SplitEditor minLines={1} />);

      // Read set value
      const editor = root.getInstance().splitEditor;
      expect(editor.getOption("minLines")).toEqual(1);
      act(() => {
	root.update(<SplitEditor minLines={2}/>)
      });

      expect(editor.getOption("minLines")).toEqual(2);
    });

    it("should update the mode on componentDidUpdate", () => {
      const root = create(<SplitEditor mode="javascript" />);

      // Read set value
      const oldMode = root.getInstance().props["mode"];
      act(() => {
	root.update(<SplitEditor mode="elixir"/>);
      });
      const newMode = root.getInstance().props["mode"];
      expect(oldMode).not.toEqual(newMode);
    });

    it("should update many props on componentDidUpdate", () => {
      const root = create(
        <SplitEditor
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
	  <SplitEditor
	    theme="solarized"
            keyboardHandler="emacs"
            fontSize={18}
	    wrapEnabled={false}
	    showPrintMargin={false}
	    showGutter={true}
            height="120px"
            width="220px"
	  />)
      });

      const newProps = root.getInstance().props;
      const propNames = ["theme", "keyboardHandler", "fontSize", "wrapEnabled",
			 "showPrintMargin", "showGutter", "height", "width"];
      propNames.forEach(propName =>
	expect(oldProps[propName]).not.toEqual(newProps[propName]));	  
    });

    // Issue in ReactAce?
    it.skip.failing("should update the className on componentDidUpdate", () => {
      const className = "old-class";
      const root = create(
        <SplitEditor className={className} />
      );

      // Read set value
      let editor = root.getInstance().refEditor;
      expect(editor.className).toEqual(
        " ace_editor ace_hidpi ace-tm old-class"
      );

      // Now trigger the componentDidUpdate
      const newClassName = "new-class";
      act(() => {
	root.update(<SplitEditor className={newClassName }/>);
      });
      editor = root.getInstance().refEditor;
      expect(editor.className).toEqual(
        " new-class ace_editor ace_hidpi ace-tm"
      );
    });

    it("should update the value on componentDidUpdate", () => {
      const startValue = "start value";
      const anotherStartValue = "another start value";
      const root = create(
        <SplitEditor value={[startValue, anotherStartValue]} />
      );

      // Read set value
      let editor = root.getInstance().split.getEditor(0);
      let editor2 = root.getInstance().split.getEditor(1);
      expect(editor.getValue()).toEqual(startValue);
      expect(editor2.getValue()).toEqual(anotherStartValue);

      // Now trigger the componentDidUpdate
      const newValue = "updated value";
      const anotherNewValue = "another updated value";
      act(() => {
	root.update(<SplitEditor value={[newValue, anotherNewValue]}/>);
      });
      editor = root.getInstance().splitEditor;
      editor2 = root.getInstance().split.getEditor(1);
      expect(editor.getValue()).toEqual(newValue);
      expect(editor2.getValue()).toEqual(anotherNewValue);
    });
    it("should set up the markers", () => {
      const markers = [
        [
          {
            startRow: 3,
            type: "text",
            className: "test-marker"
          }
        ]
      ];
      const root = create(<SplitEditor markers={markers} />);

      // Read the markers
      const editor = root.getInstance().splitEditor;
      expect(editor.getSession().getMarkers()["3"].clazz).toEqual(
        "test-marker"
      );
      expect(editor.getSession().getMarkers()["3"].type).toEqual("text");
    });

    it("should update the markers", () => {
      const oldMarkers = [
        [
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
        ]
      ];
      const markers = [
        [
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
        ]
      ];
      const root = create(<SplitEditor markers={oldMarkers} />);

      // Read the markers
      const editor = root.getInstance().splitEditor;
      expect(editor.getSession().getMarkers()["3"].clazz).toEqual(
        "test-marker-old"
      );
      expect(editor.getSession().getMarkers()["3"].type).toEqual("text");
      act(() => {
	root.update(<SplitEditor markers={markers }/>);
      });
      const editorB = root.getInstance().splitEditor;
      expect(editorB.getSession().getMarkers()["6"].clazz).toEqual(
        "test-marker-new"
      );
      expect(editorB.getSession().getMarkers()["6"].type).toEqual("text");
    });

    it("should update the markers", () => {
      const oldMarkers = [
        [
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
        ]
      ];
      const markers = [[]];
      const root = create(<SplitEditor markers={oldMarkers} />);

      // Read the markers
      const editor = root.getInstance().splitEditor;
      expect(editor.getSession().getMarkers()["3"].clazz).toEqual(
        "test-marker-old"
      );
      expect(editor.getSession().getMarkers()["3"].type).toEqual("text");
      act(() => {
	root.update(<SplitEditor markers={markers }/>);
      });
      const editorB = root.getInstance().splitEditor;
      expect(editorB.getSession().getMarkers()).toMatchObject({});
    });

    it("should add annotations", () => {
      const annotations = [
        {
          row: 3, // must be 0 based
          column: 4, // must be 0 based
          text: "error.message", // text to show in tooltip
          type: "error"
        }
      ];
      const root = create(<SplitEditor />);
      const editor = root.getInstance().splitEditor;
      act(() => {
	root.update(<SplitEditor annotations={ [annotations] }/>);
      });
      expect(editor.getSession().getAnnotations()).toMatchObject(annotations);
      act(() => {
	root.update(<SplitEditor annotations={ null }/>);
      });
      expect(editor.getSession().getAnnotations()).toMatchObject([]);
    });

    it.skip("should trigger the focus on componentDidUpdate", () => {
      const onFocusCallback = jest.fn();
      const root = create(<SplitEditor onFocus={onFocusCallback} />);

      // Read the focus
      expect(onFocusCallback.mock.calls).toHaveLength(0);

      // Now trigger the componentDidUpdate
      act(() => {
	root.update(<SplitEditor focus={ true }/>);
      });
      expect(onFocusCallback.mock.calls).toHaveLength(1);
    });
  });
});
