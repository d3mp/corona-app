import { act, renderHook } from "@testing-library/react-hooks";
import useLocalStorage from "../useLocalStorage";

describe("useLocalStorage", () => {
  beforeAll(() => {
    Storage.prototype.getItem = jest
      .fn()
      .mockImplementation(() => JSON.stringify("Dark"));
    Storage.prototype.setItem = jest.fn();
  });

  it("should handle get data", () => {
    const { result } = renderHook(() => useLocalStorage("theme"));

    expect(localStorage.getItem).toHaveBeenCalledWith("theme");
    expect(result.current[0]).toEqual("Dark");
  });

  it("should handle set data", () => {
    const { result } = renderHook(() => useLocalStorage("theme"));

    act(() => {
      result.current[1]("Light");
    });

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "theme",
      JSON.stringify("Light")
    );
  });
});
