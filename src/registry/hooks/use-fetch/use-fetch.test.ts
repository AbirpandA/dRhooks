import { renderHook, waitFor } from "@testing-library/react";
import { useFetch } from "./use-fetch";
import axios from "axios";
import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("axios");

describe("useFetch", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch data successfully", async () => {
    const mockData = { message: "success" };
    (axios.get as unknown as import("vitest").Mock).mockResolvedValueOnce({
      data: mockData,
    });
    (axios.isCancel as unknown as import("vitest").Mock).mockReturnValue(false);

    const { result } = renderHook(() =>
      useFetch("https://api.example.com/data")
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it("should handle error", async () => {
    const mockError = new Error("Network Error");
    (axios.get as unknown as import("vitest").Mock).mockRejectedValueOnce(
      mockError
    );
    (axios.isCancel as unknown as import("vitest").Mock).mockReturnValue(false);

    const { result } = renderHook(() =>
      useFetch("https://api.example.com/data")
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(mockError);
    expect(result.current.data).toBeNull();
  });
});
