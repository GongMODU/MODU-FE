import { colors } from "@/styles";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// 태그 타입
export type ScheduleTag =
  | "수요예측"
  | "공모청약"
  | "락업해제"
  | "환불"
  | "상장"
  | "배정";

// 태그별 색상 매핑
export const TAG_COLORS: Record<ScheduleTag, string> = {
  수요예측: colors.calender.demandBlue,
  공모청약: colors.primary600,
  락업해제: colors.calender.lockupPink,
  환불: colors.calender.refundSlate,
  상장: colors.calender.listingGreen,
  배정: colors.calender.allocationOrange,
};

export type CalendarEvent = {
  id: string;
  ipoId: number;
  date: Date; // 이벤트 날짜
  companyName: string;
  tag: ScheduleTag;
};

type Props = {
  year: number;
  month: number; // 1-12
  events?: CalendarEvent[];
  selectedTags?: ScheduleTag[] | null;
  onEventPress?: (ipoId: number) => void;
};

const WEEKDAYS = ["월", "화", "수", "목", "금"];

// 해당 월의 월~금 날짜 행 배열 생성
function buildCalendarWeeks(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  // 첫 번째 월요일 찾기 (해당 주의 월요일)
  const firstMonday = new Date(firstDay);
  const firstDayOfWeek = firstDay.getDay(); // 0=일 1=월 ... 6=토
  // 월요일로 맞추기
  const diff =
    firstDayOfWeek === 0 ? 1 : firstDayOfWeek === 1 ? 0 : -(firstDayOfWeek - 1);
  firstMonday.setDate(firstDay.getDate() + diff);

  const weeks: (Date | null)[][] = [];
  const cursor = new Date(firstMonday);

  while (cursor <= lastDay || weeks.length < 4) {
    const week: (Date | null)[] = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(cursor);
      d.setDate(cursor.getDate() + i);
      // 해당 월에 속하는 날짜만 표시 (전달/다음달은 null 대신 날짜 표시는 하되 month 체크)
      week.push(d);
    }
    weeks.push(week);
    cursor.setDate(cursor.getDate() + 7);
    if (cursor > lastDay && weeks.length >= 4) break;
  }

  return weeks;
}

export default function SubscriptionCalendar({
  year,
  month,
  events = [],
  selectedTags,
  onEventPress,
}: Props) {
  const weeks = useMemo(() => buildCalendarWeeks(year, month), [year, month]);

  // 날짜 key별 이벤트 그룹
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((ev) => {
      const key = `${ev.date.getFullYear()}-${ev.date.getMonth() + 1}-${ev.date.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    });
    return map;
  }, [events]);

  const today = new Date();

  function getEventsForDate(date: Date): CalendarEvent[] {
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const all = eventsByDate[key] ?? [];
    if (selectedTags && selectedTags.length > 0)
      return all.filter((e) => selectedTags.includes(e.tag));
    return all;
  }

  function isToday(date: Date): boolean {
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  function isCurrentMonth(date: Date): boolean {
    return date.getMonth() + 1 === month && date.getFullYear() === year;
  }

  return (
    <View style={styles.container}>
      {/* 요일 헤더 */}
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((d) => (
          <View key={d} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{d}</Text>
          </View>
        ))}
      </View>

      {/* 날짜 행 */}
      {weeks.map((week, wi) => (
        <View
          key={wi}
          style={[
            styles.weekRow,
            wi === weeks.length - 1 && { borderBottomWidth: 0 },
          ]}
        >
          {week.map((date, di) => {
            if (!date) return <View key={di} style={styles.dayCell} />;
            const dayEvents = getEventsForDate(date);
            const today_ = isToday(date);
            const inMonth = isCurrentMonth(date);
            // 최대 2개 표시, 나머지는 생략
            const visibleEvents = dayEvents.slice(0, 2);
            const hiddenCount = dayEvents.length - visibleEvents.length;

            return (
              <View key={di} style={styles.dayCell}>
                {/* 날짜 숫자 */}
                <View
                  style={[styles.dateNumberWrap, today_ && styles.todayCircle]}
                >
                  <Text
                    style={[
                      styles.dateNumber,
                      !inMonth && styles.dateNumberOutOfMonth,
                      today_ && styles.todayText,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                </View>

                {/* 이벤트 뱃지 */}
                <View style={styles.eventList}>
                  {visibleEvents.map((ev) => (
                    <TouchableOpacity
                      key={ev.id}
                      style={[
                        styles.eventBadge,
                        { backgroundColor: TAG_COLORS[ev.tag] },
                      ]}
                      onPress={() => onEventPress?.(ev.ipoId)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.eventText} numberOfLines={1}>
                        {ev.companyName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {hiddenCount > 0 && (
                    <View style={[styles.eventBadge, styles.eventBadgeGray]}>
                      <Text style={styles.eventTextGray}>+{hiddenCount}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
    overflow: "hidden",
    marginBottom: 24,
  },
  weekdayRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray200,
  },
  weekdayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  weekdayText: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.gray500,
  },
  weekRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray200,
    minHeight: 64,
  },
  dayCell: {
    flex: 1,
    paddingHorizontal: 2,
    paddingTop: 4,
    paddingBottom: 4,
    overflow: "hidden",
  },
  dateNumberWrap: {
    alignSelf: "flex-start",
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
    marginLeft: 2,
    borderRadius: 10,
  },
  todayCircle: {
    // 원 제거
  },
  dateNumber: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.gray800,
  },
  dateNumberOutOfMonth: {
    color: colors.gray300,
  },
  todayText: {
    color: colors.primary600,
    fontWeight: "700",
  },
  eventList: {
    gap: 2,
  },
  eventBadge: {
    borderRadius: 16,
    paddingHorizontal: 4,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  eventBadgeGray: {
    backgroundColor: colors.gray100,
  },
  eventText: {
    fontSize: 8,
    fontWeight: "500",
    color: colors.white,
  },
  eventTextGray: {
    fontSize: 8,
    fontWeight: "500",
    color: colors.gray500,
  },
});
