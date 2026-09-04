import React, { useState } from 'react';

interface ClubScheduleTabProps {
  clubId: string;
  clubName: string;
}

interface ScheduledClass {
  id: string;
  name: string;
  type: 'group' | 'private' | 'camp' | 'clinic';
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string;
  endTime: string;
  court: string;
  coachId: string;
  coachName: string;
  level: string;
  maxStudents: number;
  enrolledStudents: {
    id: string;
    name: string;
  }[];
  isRecurring: boolean;
  notes?: string;
}

// Mock schedule data - in production this would come from external system or API
const MOCK_SCHEDULE: ScheduledClass[] = [
  {
    id: '1',
    name: 'Junior Beginners',
    type: 'group',
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '10:00',
    court: 'Court 1',
    coachId: 'coach-1',
    coachName: 'Coach Sarah',
    level: 'Beginner (2.0-2.5)',
    maxStudents: 8,
    enrolledStudents: [
      { id: 's1', name: 'Emma Wilson' },
      { id: 's2', name: 'Jake Thompson' },
      { id: 's3', name: 'Mia Chen' },
      { id: 's4', name: 'Lucas Brown' },
      { id: 's5', name: 'Olivia Davis' },
    ],
    isRecurring: true,
  },
  {
    id: '2',
    name: 'Advanced Junior Squad',
    type: 'group',
    dayOfWeek: 1, // Monday
    startTime: '10:30',
    endTime: '12:00',
    court: 'Court 2',
    coachId: 'coach-2',
    coachName: 'Coach Mike',
    level: 'Advanced (4.0-4.5)',
    maxStudents: 6,
    enrolledStudents: [
      { id: 's6', name: 'Noah Martinez' },
      { id: 's7', name: 'Sophia Lee' },
      { id: 's8', name: 'Ethan Johnson' },
      { id: 's9', name: 'Ava Williams' },
    ],
    isRecurring: true,
  },
  {
    id: '3',
    name: 'Adult Intermediate',
    type: 'group',
    dayOfWeek: 1, // Monday
    startTime: '18:00',
    endTime: '19:30',
    court: 'Court 3',
    coachId: 'coach-1',
    coachName: 'Coach Sarah',
    level: 'Intermediate (3.0-3.5)',
    maxStudents: 8,
    enrolledStudents: [
      { id: 's10', name: 'James Anderson' },
      { id: 's11', name: 'Emily Taylor' },
      { id: 's12', name: 'Michael Scott' },
      { id: 's13', name: 'Rachel Green' },
      { id: 's14', name: 'David Kim' },
      { id: 's15', name: 'Jennifer Lopez' },
    ],
    isRecurring: true,
  },
  {
    id: '4',
    name: 'Junior Beginners',
    type: 'group',
    dayOfWeek: 2, // Tuesday
    startTime: '15:30',
    endTime: '16:30',
    court: 'Court 1',
    coachId: 'coach-3',
    coachName: 'Coach Alex',
    level: 'Beginner (2.0-2.5)',
    maxStudents: 8,
    enrolledStudents: [
      { id: 's16', name: 'Lily Parker' },
      { id: 's17', name: 'Ryan Hughes' },
      { id: 's18', name: 'Chloe Adams' },
    ],
    isRecurring: true,
  },
  {
    id: '5',
    name: 'Competition Training',
    type: 'group',
    dayOfWeek: 2, // Tuesday
    startTime: '17:00',
    endTime: '19:00',
    court: 'Court 2 & 3',
    coachId: 'coach-2',
    coachName: 'Coach Mike',
    level: 'Advanced (4.5+)',
    maxStudents: 8,
    enrolledStudents: [
      { id: 's6', name: 'Noah Martinez' },
      { id: 's7', name: 'Sophia Lee' },
      { id: 's19', name: 'Daniel White' },
      { id: 's20', name: 'Grace Kim' },
      { id: 's21', name: 'Brandon Lee' },
    ],
    isRecurring: true,
  },
  {
    id: '6',
    name: 'Private Lesson',
    type: 'private',
    dayOfWeek: 3, // Wednesday
    startTime: '09:00',
    endTime: '10:00',
    court: 'Court 1',
    coachId: 'coach-1',
    coachName: 'Coach Sarah',
    level: 'Intermediate (3.5)',
    maxStudents: 1,
    enrolledStudents: [
      { id: 's22', name: 'Thomas Reed' },
    ],
    isRecurring: true,
    notes: 'Focus on serve technique',
  },
  {
    id: '7',
    name: 'Tiny Tennis (Ages 4-6)',
    type: 'group',
    dayOfWeek: 3, // Wednesday
    startTime: '10:30',
    endTime: '11:15',
    court: 'Mini Court',
    coachId: 'coach-3',
    coachName: 'Coach Alex',
    level: 'Red Ball',
    maxStudents: 6,
    enrolledStudents: [
      { id: 's23', name: 'Zoe Mitchell' },
      { id: 's24', name: 'Max Turner' },
      { id: 's25', name: 'Ella Cooper' },
      { id: 's26', name: 'Leo Wright' },
    ],
    isRecurring: true,
  },
  {
    id: '8',
    name: 'Junior Intermediate',
    type: 'group',
    dayOfWeek: 4, // Thursday
    startTime: '16:00',
    endTime: '17:30',
    court: 'Court 1',
    coachId: 'coach-1',
    coachName: 'Coach Sarah',
    level: 'Intermediate (3.0-3.5)',
    maxStudents: 8,
    enrolledStudents: [
      { id: 's27', name: 'Sophie Brown' },
      { id: 's28', name: 'Jack Wilson' },
      { id: 's29', name: 'Amy Chen' },
      { id: 's30', name: 'Ben Davis' },
      { id: 's31', name: 'Kate Miller' },
      { id: 's32', name: 'Sam Johnson' },
    ],
    isRecurring: true,
  },
  {
    id: '9',
    name: 'Adult Cardio Tennis',
    type: 'clinic',
    dayOfWeek: 5, // Friday
    startTime: '06:30',
    endTime: '07:30',
    court: 'Court 2',
    coachId: 'coach-2',
    coachName: 'Coach Mike',
    level: 'All Levels',
    maxStudents: 12,
    enrolledStudents: [
      { id: 's33', name: 'Jessica Moore' },
      { id: 's34', name: 'Chris Taylor' },
      { id: 's35', name: 'Amanda White' },
      { id: 's36', name: 'Kevin Black' },
      { id: 's37', name: 'Laura Green' },
      { id: 's38', name: 'Mark Brown' },
      { id: 's39', name: 'Sarah Davis' },
      { id: 's40', name: 'Tom Wilson' },
    ],
    isRecurring: true,
  },
  {
    id: '10',
    name: 'Saturday Junior Camp',
    type: 'camp',
    dayOfWeek: 6, // Saturday
    startTime: '09:00',
    endTime: '12:00',
    court: 'All Courts',
    coachId: 'coach-1',
    coachName: 'Coach Sarah',
    level: 'Mixed Levels',
    maxStudents: 20,
    enrolledStudents: [
      { id: 's1', name: 'Emma Wilson' },
      { id: 's2', name: 'Jake Thompson' },
      { id: 's3', name: 'Mia Chen' },
      { id: 's6', name: 'Noah Martinez' },
      { id: 's7', name: 'Sophia Lee' },
      { id: 's8', name: 'Ethan Johnson' },
      { id: 's16', name: 'Lily Parker' },
      { id: 's17', name: 'Ryan Hughes' },
      { id: 's27', name: 'Sophie Brown' },
      { id: 's28', name: 'Jack Wilson' },
      { id: 's29', name: 'Amy Chen' },
      { id: 's30', name: 'Ben Davis' },
    ],
    isRecurring: true,
    notes: 'Assistants: Coach Mike, Coach Alex',
  },
];

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ClubScheduleTab: React.FC<ClubScheduleTabProps> = ({ clubId, clubName }) => {
  const [schedule] = useState<ScheduledClass[]>(MOCK_SCHEDULE);
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [selectedCoach, setSelectedCoach] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedClass, setSelectedClass] = useState<ScheduledClass | null>(null);

  // Get unique coaches
  const coaches = Array.from(new Set(schedule.map(c => c.coachId))).map(id => {
    const cls = schedule.find(c => c.coachId === id);
    return { id, name: cls?.coachName || '' };
  });

  // Filter schedule
  const filteredSchedule = schedule.filter(cls => {
    if (selectedDay !== 'all' && cls.dayOfWeek !== selectedDay) return false;
    if (selectedCoach !== 'all' && cls.coachId !== selectedCoach) return false;
    return true;
  });

  // Group by day for grid view
  const scheduleByDay = DAYS_OF_WEEK.reduce((acc, _, dayIndex) => {
    acc[dayIndex] = filteredSchedule.filter(c => c.dayOfWeek === dayIndex)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {} as Record<number, ScheduledClass[]>);

  const getTypeColor = (type: ScheduledClass['type']) => {
    switch (type) {
      case 'group': return 'bg-blue-100 text-blue-700';
      case 'private': return 'bg-purple-100 text-purple-700';
      case 'camp': return 'bg-orange-100 text-orange-700';
      case 'clinic': return 'bg-green-100 text-green-700';
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  // Stats
  const totalClasses = schedule.length;
  const totalStudents = new Set(schedule.flatMap(c => c.enrolledStudents.map(s => s.id))).size;
  const totalCoaches = coaches.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Class Schedule</h2>
          <p className="text-sm text-gray-500">Weekly class schedule and coach assignments</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import Schedule
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 border-l-4 border-l-portal-club">
          <p className="text-sm text-gray-500">Weekly Classes</p>
          <p className="text-2xl font-bold text-gray-900">{totalClasses}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Enrolled Students</p>
          <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Active Coaches</p>
          <p className="text-2xl font-bold text-gray-900">{totalCoaches}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Day:</span>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-portal-club"
          >
            <option value="all">All Days</option>
            {DAYS_OF_WEEK.map((day, i) => (
              <option key={day} value={i}>{day}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Coach:</span>
          <select
            value={selectedCoach}
            onChange={(e) => setSelectedCoach(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-portal-club"
          >
            <option value="all">All Coaches</option>
            {coaches.map(coach => (
              <option key={coach.id} value={coach.id}>{coach.name}</option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Schedule View */}
      {viewMode === 'list' ? (
        <div className="space-y-3">
          {filteredSchedule.length > 0 ? (
            filteredSchedule
              .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime))
              .map(cls => (
                <div
                  key={cls.id}
                  onClick={() => setSelectedClass(cls)}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer border-l-4 border-l-portal-club"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{cls.name}</h4>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${getTypeColor(cls.type)}`}>
                          {cls.type.charAt(0).toUpperCase() + cls.type.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{cls.level}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium text-gray-900">{DAYS_OF_WEEK[cls.dayOfWeek]}</p>
                      <p className="text-gray-500">{formatTime(cls.startTime)} - {formatTime(cls.endTime)}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <svg className="w-4 h-4 text-portal-club" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {cls.court}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <svg className="w-4 h-4 text-portal-club" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {cls.coachName}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <svg className="w-4 h-4 text-portal-club" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {cls.enrolledStudents.length}/{cls.maxStudents} students
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">No classes found</h3>
              <p className="text-sm text-gray-500">Try adjusting your filters</p>
            </div>
          )}
        </div>
      ) : (
        /* Week Grid View */
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-200">
            {DAYS_SHORT.map((day, i) => (
              <div key={day} className={`p-3 text-center text-sm font-medium ${
                scheduleByDay[i]?.length > 0 ? 'text-gray-900 bg-gray-50' : 'text-gray-400'
              }`}>
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 min-h-[400px]">
            {DAYS_OF_WEEK.map((_, dayIndex) => (
              <div key={dayIndex} className="border-r border-gray-100 last:border-r-0 p-2 space-y-2">
                {scheduleByDay[dayIndex]?.map(cls => (
                  <div
                    key={cls.id}
                    onClick={() => setSelectedClass(cls)}
                    className={`p-2 rounded-lg text-xs cursor-pointer hover:shadow transition-shadow ${getTypeColor(cls.type)}`}
                  >
                    <p className="font-medium truncate">{cls.name}</p>
                    <p className="opacity-75">{formatTime(cls.startTime)}</p>
                    <p className="opacity-75 truncate">{cls.coachName}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Class Detail Modal */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{selectedClass.name}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${getTypeColor(selectedClass.type)}`}>
                      {selectedClass.type.charAt(0).toUpperCase() + selectedClass.type.slice(1)}
                    </span>
                  </div>
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
              {/* Schedule Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium">Day & Time</p>
                  <p className="font-semibold text-gray-900">{DAYS_OF_WEEK[selectedClass.dayOfWeek]}</p>
                  <p className="text-sm text-gray-600">{formatTime(selectedClass.startTime)} - {formatTime(selectedClass.endTime)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium">Location</p>
                  <p className="font-semibold text-gray-900">{selectedClass.court}</p>
                </div>
              </div>

              {/* Coach */}
              <div className="flex items-center gap-3 p-3 bg-portal-club/10 rounded-lg">
                <div className="w-10 h-10 bg-portal-club rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{selectedClass.coachName.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Assigned Coach</p>
                  <p className="font-semibold text-gray-900">{selectedClass.coachName}</p>
                </div>
              </div>

              {/* Notes */}
              {selectedClass.notes && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-700 uppercase font-medium mb-1">Notes</p>
                  <p className="text-sm text-yellow-800">{selectedClass.notes}</p>
                </div>
              )}

              {/* Enrolled Students */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700">
                    Enrolled Students ({selectedClass.enrolledStudents.length}/{selectedClass.maxStudents})
                  </p>
                  {selectedClass.enrolledStudents.length >= selectedClass.maxStudents && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">Full</span>
                  )}
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedClass.enrolledStudents.map(student => (
                    <div key={student.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-medium">{student.name.charAt(0)}</span>
                      </div>
                      <span className="text-sm text-gray-900">{student.name}</span>
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
                className="flex-1 py-3 bg-portal-club text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors"
              >
                Edit Class
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800">External Scheduling System</p>
            <p className="text-sm text-blue-700 mt-1">
              This schedule is synced from your club's booking system. To make changes to classes or enrollments, 
              please use your primary scheduling platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubScheduleTab;
