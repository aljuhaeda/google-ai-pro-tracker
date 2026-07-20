class ContextModels {
  constructor() {
    this.temporalModel = new TemporalModel();
    this.workloadModel = new WorkloadModel();
    this.socialModel = new SocialModel();
  }

  async analyze(context) {
    const temporalAnalysis = this.temporalModel.analyze(context.temporal);
    const workloadAnalysis = this.workloadModel.analyze(context.workload);
    const socialAnalysis = this.socialModel.analyze(context.social);

    return {
      temporal: temporalAnalysis,
      workload: workloadAnalysis,
      social: socialAnalysis,
    };
  }
}

class TemporalModel {
  analyze(temporalContext) {
    let timeOfDayCategory = 'unknown';
    if (temporalContext.hour >= 5 && temporalContext.hour < 12) {
      timeOfDayCategory = 'morning';
    } else if (temporalContext.hour >= 12 && temporalContext.hour < 17) {
      timeOfDayCategory = 'afternoon';
    } else if (temporalContext.hour >= 17 && temporalContext.hour < 21) {
      timeOfDayCategory = 'evening';
    } else {
      timeOfDayCategory = 'night';
    }

    let dayType = 'weekday';
    if (temporalContext.dayOfWeek === 0 || temporalContext.dayOfWeek === 6) {
      dayType = 'weekend';
    }

    return {
      timeOfDayCategory,
      dayType,
      isWorkingHours: temporalContext.workingHours,
      timeUntilNextMeeting: temporalContext.timeUntilNextMeeting,
    };
  }
}

class WorkloadModel {
  analyze(workloadContext) {
    let workloadLevel = 'low';
    if (workloadContext.meetingDensity > 0.7 || workloadContext.emailPressure > 0.7 || workloadContext.deadlineProximity > 0.7) {
      workloadLevel = 'high';
    } else if (workloadContext.meetingDensity > 0.4 || workloadContext.emailPressure > 0.4 || workloadContext.deadlineProximity > 0.4) {
      workloadLevel = 'medium';
    }

    return {
      workloadLevel,
      meetingDensity: workloadContext.meetingDensity,
      emailPressure: workloadContext.emailPressure,
      deadlineProximity: workloadContext.deadlineProximity,
      taskComplexity: workloadContext.taskComplexity,
    };
  }
}

class SocialModel {
  analyze(socialContext) {
    let socialInteractionLevel = 'low';
    if (socialContext.unreadMessages > 5 || socialContext.teamStatus === 'online') {
      socialInteractionLevel = 'high';
    }

    return {
      socialInteractionLevel,
      teamStatus: socialContext.teamStatus,
      unreadMessages: socialContext.unreadMessages,
    };
  }
}