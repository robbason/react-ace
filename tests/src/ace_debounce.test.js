/**
 * @jest-environment jsdom
 */
import React from 'react'

import {create, act} from 'react-test-renderer';

import AceEditor from "../../src/ace";


test("function arg should be called when after timeout", done => {
  const root = create(<AceEditor />);
  var flag = false;
  var func = root.getInstance().debounce(function () {
    flag = true;
  }, 100);
  func();
  expect(flag).toEqual(false);
  setTimeout(function () {
    expect(flag).toEqual(true);
    done();
  }, 150);
});


test("timer should be reset on successive call", done => {
  const root = create(<AceEditor />);
  
  var flag = false;
  var func = root.getInstance().debounce(function () {
    flag = true;
  }, 100);
  func();
  expect(flag).toEqual(false);
  setTimeout(function () {
    expect(flag).toEqual(false);
    func();
  }, 50);
  setTimeout(function () {
    expect(flag).toEqual(false);
  }, 120);
  setTimeout(function () {
    expect(flag).toEqual(true);
    done();
  }, 160);
});


test("function should be called only once per period", done => {
  const root = create(<AceEditor />);

  var flag1 = false;
  var flag2 = false;
  var func = root.getInstance().debounce(function () {
    if (flag1) {
      flag2 = true;
    }
    flag1 = true;
  }, 100);

  func();
  expect(flag1).toEqual(false);
  expect(flag2).toEqual(false);
  setTimeout(function () {
    expect(flag1).toEqual(false);
    expect(flag2).toEqual(false);
    func();
    setTimeout(function () {
      expect(flag1).toEqual(true);
      expect(flag2).toEqual(false);
      func();
      setTimeout(function () {
        expect(flag1).toEqual(true);
        expect(flag2).toEqual(false);
        done();
      }, 90);
    }, 110);
  }, 50);
});


test("should keep initial value after undo event", done => {
  const onInput = () => {
    const editor = root.getInstance().editor;
    editor.undo();
    expect(editor.getValue()).toEqual("foobar");
    done();
  };
  const root = create(
    <AceEditor value="foobar" onInput={onInput} />
  );
 
});
  
