import type { Prisma } from '@prisma/client'

export type Account = Prisma.AccountGetPayload<{}>

export type Session = Prisma.SessionGetPayload<{}>

export type User = Prisma.UserGetPayload<{
  include: {
    projects: true
    tasks: true
    comments: true
    notifications: true
    timeTracking: true
    sharedProjects: true
    TeamMember: true
    accounts: true
    sessions: true
    PasswordResetCode: true
    PasswordResetToken: true
  }
}>

export type VerificationToken = Prisma.VerificationTokenGetPayload<{}>

export type PasswordResetCode = Prisma.PasswordResetCodeGetPayload<{}>

export type PasswordResetToken = Prisma.PasswordResetTokenGetPayload<{}>

export type Project = Prisma.ProjectGetPayload<{
  include: {
    tasks: {
      include: {
        comments: true,
        tags: true,
        subTasks: true,
        owner: true,
        TimeTracking: true,
        project: true,
        team: true
      }
    },
    comments: {
      include: {
        user: true,
        Project: true
      }
    },
    client: true,
    sharedWith: true,
    owner: true
    team: true
  }
}>

export type Client = Prisma.ClientGetPayload<{
  include: {
    projects: true
  }
}>

export type Task = Prisma.TaskGetPayload<{
  include: {
    project: true
    owner: true
    team: true
    comments: true
    tags: true
    status: true
    subTasks: true
    TimeTracking: true
  }
}>

export type SubTask = Prisma.SubTaskGetPayload<{}>

export type Notification = Prisma.NotificationGetPayload<{
  include: {
    user: true
  }
}>

export type TimeTracking = Prisma.TimeTrackingGetPayload<{
  include: {
    user: true
    task: true
  }
}>

export type Subscription = Prisma.SubscriptionGetPayload<{
  include: {
    user: true
  }
}>

export type Team = Prisma.TeamGetPayload<{
  include: {
    projects: true
    members: true
    tasks: true
  }
}>

export type TeamMember = Prisma.TeamMemberGetPayload<{
  include: {
    user: true
    team: true
  }
}>

export type SharedProject = Prisma.SharedProjectGetPayload<{
  include: {
    user: true
    project: true
  }
}>

export type TaskTag = Prisma.TaskTagGetPayload<{}>

export type Comment = Prisma.CommentGetPayload<{
  include: {
    task: true
    user: true
    Project: true
  }
}>
