"use strict";

describe("Factory: Evented", function()
{
	// load the controller"s module
	beforeEach(module("enlightenApp"));

	var _Evented;

	// Initialize the factory and a mock scope
	beforeEach(inject(function(Evented)
	{
		_Evented = Evented;
	}));

	it("should call a single listener for a given event type", function()
	{
		var spy = jasmine.createSpy();

		_Evented.register("MyEvent", spy);
		_Evented.emit("MyEvent", null);

		expect(spy.calls.count()).toEqual(1);
	});

	it("should call n number of listeners for a given event type", function()
	{
		var spyA = jasmine.createSpy();
		var spyB = jasmine.createSpy();
		var spyC = jasmine.createSpy();

		_Evented.register("MyEvent", spyA);
		_Evented.register("MyEvent", spyB);
		_Evented.register("MyEvent", spyC);

		_Evented.emit("MyEvent", null);

		expect(spyA.calls.count()).toEqual(1);
		expect(spyB.calls.count()).toEqual(1);
		expect(spyC.calls.count()).toEqual(1);
	});

	it("should call a listener with an expanded argument array", function()
	{
		var spy = jasmine.createSpy();

		_Evented.register("MyEvent", spy);
		_Evented.emit("MyEvent", ["argA", {key: "value"}]);

		expect(spy).toHaveBeenCalledWith("argA", {key:"value"});
	});
});
