import type { Prisma } from '@prisma/client'

// Tipos base (sem includes explícitos, caso precise de uma versão "pura")
export type Account = Prisma.AccountGetPayload<{}>
export type Session = Prisma.SessionGetPayload<{}>
export type VerificationToken = Prisma.VerificationTokenGetPayload<{}>
export type PasswordResetCode = Prisma.PasswordResetCodeGetPayload<{}>
export type PasswordResetToken = Prisma.PasswordResetTokenGetPayload<{}>
export type SubTask = Prisma.SubTaskGetPayload<{}>
export type TaskTag = Prisma.TaskTagGetPayload<{}>
export type Note = Prisma.NoteGetPayload<{}>

// -----------------------------------------------------------------------------
// Tipos com Includes para dados mais completos
// Esses tipos são úteis quando for necessário buscar dados relacionados
// -----------------------------------------------------------------------------

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    projects: true
    tasks: true
    commentsProject: true
    commentsTask: true
    notifications: true
    timeTracking: true
    sharedProjects: true
    TeamMember: true
    accounts: true
    sessions: true
    PasswordResetCode: true
    PasswordResetToken: true
    subscription: true
  }
}>

export type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: {
    tasks: {
      include: {
        commentsTask: {
          include: {
            user: true
          }
        }
        tags: true
        subTasks: true
        owner: true
        TimeTracking: true
        project: true
        team: true
      }
    }
    commentsProject: { 
      include: {
        user: true // Inclui o usuário do comentário do projeto
      }
    }
    client: true
    sharedWith: true
    owner: true
    team: true
    Briefing: true
  }
}>

export type ClientWithRelations = Prisma.ClientGetPayload<{
  include: {
    projects: true
    Briefing: true
  }
}>

export type TaskWithRelations = Prisma.TaskGetPayload<{
  include: {
    project: true
    owner: true
    team: true
    commentsTask: {
      include: {
        user: true
      }
    }
    tags: true
    subTasks: true
    TimeTracking: true
  }
}>

export type NotificationWithUser = Prisma.NotificationGetPayload<{
  include: {
    user: true
  }
}>

export type TimeTrackingWithRelations = Prisma.TimeTrackingGetPayload<{
  include: {
    user: true
    task: true
  }
}>

export type SubscriptionWithUser = Prisma.SubscriptionGetPayload<{
  include: {
    user: true
  }
}>

export type TeamWithRelations = Prisma.TeamGetPayload<{
  include: {
    projects: true
    members: true
    Task: true
  }
}>

export type TeamMemberWithRelations = Prisma.TeamMemberGetPayload<{
  include: {
    user: true
    team: true
  }
}>

export type SharedProjectWithRelations = Prisma.SharedProjectGetPayload<{
  include: {
    user: true
    project: true
  }
}>

// Tipos para os novos modelos de comentários
export type CommentProjectWithUser = Prisma.CommentProjectGetPayload<{
  include: {
    user: true
    Project: true // Inclui o projeto ao qual o comentário pertence
  }
}>

export type CommentTaskWithUser = Prisma.CommentTaskGetPayload<{
  include: {
    user: true
    task: true // Inclui a tarefa à qual o comentário pertence
  }
}>

export type BriefingWithRelations = Prisma.BriefingGetPayload<{
  include: {
    client: true,
    project: true,
    notes: true
  }
}>