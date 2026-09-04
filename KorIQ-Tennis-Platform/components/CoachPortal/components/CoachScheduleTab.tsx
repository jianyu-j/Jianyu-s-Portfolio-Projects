import React, { useState } from 'react';

interface CoachScheduleTabProps {
  coachId: string;
  coachName: string;
  clubName: string;
}

interface ScheduledClass {
  id: string;
  name: string;
  type: 'group' | 'private' | 'camp' | 'clinic';
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  court: string;
  level: string;
  maxStudents: number;
  enrolledStudents: {
    id: string;
    name: string;
    age?: number;
    level?: string;
  }[];
  isRecurring: boolean;
  notes?: string;
}

// Mock schedule - filtered by coach ID in production
const createMockSchedule = (): ScheduledClass[] => [
  {
    id: '1',
    name: 'Junior Beginners',
    type: 'group',
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '10:00',
    court: 'Court 1',
    level: 'Beginner (2.0-2.5)',
    maxStudents: 8,
    enrolledStudents: [
      { id: 's1', name: 'Emma Wilson', age: 10, level: '2.0' },
      { id: 's2', name: 'Jake Thompson', age: 11, level: '2.5' },
      { id: 's3', name: 'Mia Chen', age: 9, level: '2.0' },
      { id: 's4', name: 'Lucas Brown', age: 10, level: '2.5' },
      { id: 's5', name: 'Olivia Davis', age: 12, level: '2.5' },
    ],
    isRecurring: true,
  },
  {
    id: '2',
    name: 'Adult Intermediate',
    type: 'group',
    dayOfWeek: 1,
    startTime: '18:00',
    endTime: '19:30',
    court: 'Court 3',
    level: 'Intermediate (3.0-3.5)',
    maxStudents: 8,
    enrolledStudents: [
      { id: 's10', name: 'James Anderson', level: '3.5' },
      { id: 's11', name: 'Emily Taylor', level: '3.0' },
      { id: 's12', name: 'Michael Scott', level: '3.5' },
      { id: 's13', name: 'Rachel Green', level: '3.0' },
      { id: 's14', name: 'David Kim', level: '3.5' },
      { id: 's15', name: 'Jennifer Lopez', level: '3.0' },
    ],
    isRecurring: true,
  },
  {
    id: '3',
    name: 'Private Lesson - Thomas',
    type: 'private',
    dayOfWeek: 3,
    startTime: '09:00',
    endTime: '10:00',
    court: 'Court 1',
    level: 'Intermediate (3.5)',
    maxStudents: 1,
    enrolledStudents: [
      { id: 's22', name: 'Thomas Reed', level: '3.5' },
    ],
    isRecurring: true,
    notes: 'Focus on serve technique - working on second serve consistency',
  },
  {
    id: '4',
    name: 'Junior Intermediate',
    type: 'group',
    dayOfWeek: 4,
    startTime: '16:00',
    endTime: '17:30',
    court: 'Court 1',
    level: 'Intermediate (3.0-3.5)',
    maxStudents: 8,
    enrolledStudents: [
      { id: 's27', name: 'Sophie Brown', age: 14, level: '3.0' },
      { id: 's28', name: 'Jack Wilson', age: 13, level: '3.5' },
      { id: 's29', name: 'Amy Chen', age: 14, level: '3.0' },
      { id: 's30', name: 'Ben Davis', age: 15, level: '3.5' },
      { id: 's31', name: 'Kate Miller', age: 13, level: '3.0' },
      { id: 's32', name: 'Sam Johnson', age: 14, level: '3.5' },
    ],
    isRecurring: true,
  },
  {
    id: '5',
    name: 'Saturday Junior Camp',
    type: 'camp',
    dayOfWeek: 6,
    startTime: '09:00',
    endTime: '12:00',
    court: 'All Courts',
    level: 'Mixed Levels',
    maxStudents: 20,
    enrolledStudents: [
      { id: 's1', name: 'Emma Wilson', age: 10 },
      { id: 's2', name: 'Jake Thompson', age: 11 },
      { id: 's3', name: 'Mia Chen', age: 9 },
      { id: 's6', name: 'Noah Martinez', age: 13 },
      { id: 's7', name: 'Sophia Lee', age: 14 },
      { id: 's8', name: 'Ethan Johnson', age: 12 },
      { id: 's27', name: 'Sophie Brown', age: 14 },
      { id: 's28', name: 'Jack Wilson', age: 13 },
      { id: 's29', name: 'Amy Chen', age: 14 },
      { id: 's30', name: 'Ben Davis', age: 15 },
      { id: 's16', name: 'Lily Parker', age: 10 },
      { id: 's17', name: 'Ryan Hughes', age: 11 },
    ],
    isRecurring: true,
    notes: 'Lead coach. Assistants: Coach Mike, Coach Alex',
  },
];

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const CoachScheduleTab: React.FC<CoachScheduleTabProps> = ({ coachId, coachName, clubName }) => {
  const [schedule] = useState<ScheduledClass[]>(createMockSchedule());
  const [selectedClass, setSelectedClass] = useState<ScheduledClass | null>(null);
  const [viewMode, setViewMode] = useState<'upcoming' | 'all'>('upcoming');

  // Get today's day of week (0-6)
  const today = new Date().getDay();

  // Sort classes: today first, then upcoming days, then past days
  const sortedSchedule = [...schedule].sort((a, b) => {
    const aDay = (a.dayOfWeek - today + 7) % 7;
    const bDay = (b.dayOfWeek - today + 7) % 7;
    if (aDay !== bDay) return aDay - bDay;
    return a.startTime.localeCompare(b.startTime);
  });

  // Filter for upcoming view (next 3 days)
  const upcomingSchedule = sortedSchedule.filter(cls => {
    const daysUntil = (cls.dayOfWeek - today + 7) % 7;
    return daysUntil <= 3 || daysUntil === 0;
  });

  const displayedSchedule = viewMode === 'upcoming' ? upcomingSchedule : sortedSchedule;

  const getTypeColor = (type: ScheduledClass['type']) => {
    switch (type) {
      case 'group': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'private': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'camp': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'clinic': return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const getDayLabel = (dayOfWeek: number) => {
    const daysUntil = (dayOfWeek - today + 7) % 7;
    if (daysUntil === 0) return 'Today';
    if (daysUntil === 1) return 'Tomorrow';
    return DAYS_OF_WEEK[dayOfWeek];
  };

  const isToday = (dayOfWeek: number) => dayOfWeek === today;

  // Stats
  const totalClasses = schedule.length;
  const totalStudents = schedule.reduce((acc, cls) => acc + cls.enrolledStudents.length, 0);
  const classesThisWeek = schedule.length; // All are weekly recurring

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Schedule</h2>
        <p className="text-sm text-gray-500">Your assigned classes at {clubName}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 border-l-4 border-l-portal-coach">
          <p className="text-sm text-gray-500">Weekly Classes</p>
          <p className="text-2xl font-bold text-gray-900">{totalClasses}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Hours/Week</p>
          <p className="text-2xl font-bold text-gray-900">
            {schedule.reduce((acc, cls) => {
              const [startH, startM] = cls.startTime.split(':').map(Number);
              const [endH, endM] = cls.endTime.split(':').map(Number);
              return acc + (endH - startH) + (endM - startM) / 60;
            }, 0).toFixed(1)}
          </p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'upcoming'
              ? 'bg-portal-coach text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setViewMode('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'all'
              ? 'bg-portal-coach text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Full Week
        </button>
      </div>

      {/* Schedule List */}
      <div className="space-y-3">
        {displayedSchedule.length > 0 ? (
          displayedSchedule.map(cls => (
            <div
              key={cls.id}
              onClick={() => setSelectedClass(cls)}
              className={`bg-white border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                isToday(cls.dayOfWeek) 
                  ? 'border-portal-coach border-l-4 border-l-portal-coach' 
                  : 'border-gray-200 border-l-4 border-l-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      isToday(cls.dayOfWeek) ? 'bg-portal-coach text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {getDayLabel(cls.dayOfWeek)}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getTypeColor(cls.type)}`}>
                      {cls.type.charAt(0).toUpperCase() + cls.type.slice(1)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mt-2">{cls.name}</h4>
                  <p className="text-sm text-gray-500">{cls.level}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatTime(cls.startTime)}</p>
                  <p className="text-sm text-gray-500">to {formatTime(cls.endTime)}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <svg className="w-4 h-4 text-portal-coach" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {cls.court}
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <svg className="w-4 h-4 text-portal-coach" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {cls.enrolledStudents.length}/{cls.maxStudents} students
                </div>
              </div>

              {cls.notes && (
                <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-yellow-700">{cls.notes}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No upcoming classes</h3>
            <p className="text-sm text-gray-500">Check back later or view your full week schedule</p>
          </div>
        )}
      </div>

      {/* Class Detail Modal */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className={`p-6 border-b border-gray-200 ${isToday(selectedClass.dayOfWeek) ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      isToday(selectedClass.dayOfWeek) ? 'bg-portal-coach text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {getDayLabel(selectedClass.dayOfWeek)}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getTypeColor(selectedClass.type)}`}>
                      {selectedClass.type.charAt(0).toUpperCase() + selectedClass.type.slice(1)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-2">{selectedClass.name}</h3>
                  <p className="text-sm text-gray-500">{selectedClass.level}</p>
                </div>
                <button
                  onClick={() => setSelectedClass(null)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Time & Location */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium">Time</p>
                  <p className="font-semibold text-gray-900">
                    {formatTime(selectedClass.startTime)} - {formatTime(selectedClass.endTime)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium">Court</p>
                  <p className="font-semibold text-gray-900">{selectedClass.court}</p>
                </div>
              </div>

              {/* Notes */}
              {selectedClass.notes && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-700 uppercase font-medium mb-1">Class Notes</p>
                  <p className="text-sm text-yellow-800">{selectedClass.notes}</p>
                </div>
              )}

              {/* Student Roster */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-900">
                    Student Roster ({selectedClass.enrolledStudents.length}/{selectedClass.maxStudents})
                  </p>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedClass.enrolledStudents.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-portal-coach/20 rounded-full flex items-center justify-center">
                          <span className="text-portal-coach font-bold">{student.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">
                            {student.age && `Age ${student.age}`}
                            {student.age && student.level && ' • '}
                            {student.level && `NTRP ${student.level}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setSelectedClass(null)}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                className="flex-1 py-3 bg-portal-coach text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
              >
                Take Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Note */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-500 text-center">
          Schedule is managed by club administration. Contact {clubName} for any changes.
        </p>
      </div>
    </div>
  );
};

export default CoachScheduleTab;
