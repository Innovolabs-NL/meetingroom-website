import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { HERO_DEMO_SUMMARIES } from "@/content/hero-demo-meeting-summaries";
import type { DemoSummary } from "@/content/hero-demo-meeting-summaries";

export type { DemoSummary, DemoSummarySection } from "@/content/hero-demo-meeting-summaries";

export type DemoTab = "memo" | "transcript" | "summary";

export type DemoMeeting = {
  id: string;
  title: string;
  dateLabel: string;
  duration: string;
  memo: string;
  summary: DemoSummary;
  transcript: { speaker: string; time: string; text: string; color: string }[];
};

type DemoMeetingRaw = {
  id: string;
  title: string;
  dateLabel: string;
  duration: string;
  memo: string;
  transcript: { speaker: string; time: string; text: string }[];
};

export type DemoFolder = {
  name: string;
  count: number;
  sectionCount: number;
};

const SPEAKER_COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#f59e0b"] as const;

type DemoMeetingId = keyof (typeof HERO_DEMO_SUMMARIES)["en"];

function enrichMeetings(raw: DemoMeetingRaw[], locale: string): DemoMeeting[] {
  const summaries =
    HERO_DEMO_SUMMARIES[locale as keyof typeof HERO_DEMO_SUMMARIES] ??
    HERO_DEMO_SUMMARIES.en;

  return raw.map((meeting) => {
    const speakerColors = new Map<string, string>();
    const summary = summaries[meeting.id as DemoMeetingId];
    if (!summary) {
      throw new Error(`Missing hero demo summary for ${meeting.id} (${locale})`);
    }

    return {
      ...meeting,
      summary,
      transcript: meeting.transcript.map((row) => {
        if (!speakerColors.has(row.speaker)) {
          speakerColors.set(row.speaker, SPEAKER_COLORS[speakerColors.size % SPEAKER_COLORS.length]);
        }
        return { ...row, color: speakerColors.get(row.speaker)! };
      }),
    };
  });
}

export function useHeroDemoData() {
  const locale = useLocale();
  const t = useTranslations("hero.demo");

  const meetings = useMemo(
    () => enrichMeetings(t.raw("meetings") as DemoMeetingRaw[], locale),
    [t, locale],
  );

  const folder = useMemo(() => t.raw("folder") as DemoFolder, [t]);

  return { meetings, folder };
}
