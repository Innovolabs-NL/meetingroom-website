"use client";

import { useEffect, useState } from "react";

export type DetectedDownloadPlatform =
  | "windows"
  | "mac-silicon"
  | "mac-unsupported"
  | "linux"
  | "mobile"
  | null;

export function isPlatformCompatible(detected: DetectedDownloadPlatform): boolean {
  return detected === "windows" || detected === "mac-silicon";
}

type NavigatorWithUaData = Navigator & {
  userAgentData?: {
    platform?: string;
    getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string }>;
  };
};

function nav(): NavigatorWithUaData {
  return navigator as NavigatorWithUaData;
}

function isIosDevice(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isWindows(): boolean {
  if (/Win/i.test(navigator.userAgent)) return true;
  return nav().userAgentData?.platform === "Windows";
}

function isMacDesktop(): boolean {
  if (isIosDevice()) return false;
  if (/Macintosh|Mac OS X/i.test(navigator.userAgent)) return true;
  return nav().userAgentData?.platform === "macOS";
}

async function detectMacArchitecture(): Promise<"arm" | "x86" | "unknown"> {
  const uaData = nav().userAgentData;
  if (uaData?.getHighEntropyValues) {
    try {
      const { architecture } = await uaData.getHighEntropyValues(["architecture"]);
      if (architecture === "arm") return "arm";
      if (architecture === "x86") return "x86";
    } catch {
      // fall through to WebGL heuristic
    }
  }

  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
    if (gl && typeof gl === "object") {
      const context = gl as WebGLRenderingContext;
      const debugInfo = context.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const renderer = context.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
        if (/Apple M\d/i.test(renderer)) return "arm";
        if (/Intel/i.test(renderer)) return "x86";
      }
    }
  } catch {
    // ignore
  }

  return "unknown";
}

export async function detectDownloadPlatform(): Promise<DetectedDownloadPlatform> {
  if (typeof window === "undefined") return null;
  if (isIosDevice()) return "mobile";

  if (isWindows()) return "windows";

  if (isMacDesktop()) {
    const arch = await detectMacArchitecture();
    if (arch === "arm") return "mac-silicon";
    if (arch === "x86") return "mac-unsupported";
    return null;
  }

  if (/Linux/i.test(navigator.userAgent)) return "linux";

  return null;
}

export function useDetectedDownloadPlatform(): DetectedDownloadPlatform | "pending" {
  const [platform, setPlatform] = useState<DetectedDownloadPlatform | "pending">("pending");

  useEffect(() => {
    let cancelled = false;
    detectDownloadPlatform().then((result) => {
      if (!cancelled) setPlatform(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return platform;
}

export function platformMatchesDownload(
  detected: DetectedDownloadPlatform,
  label: string
): boolean {
  const platform = platformFromLabel(label);
  if (detected === "windows") return platform === "windows";
  if (detected === "mac-silicon") return platform === "mac";
  return false;
}

function platformFromLabel(label: string): "windows" | "mac" | "other" {
  if (/windows|x64|win/i.test(label)) return "windows";
  if (/mac|apple|silicon|m\d/i.test(label)) return "mac";
  return "other";
}
