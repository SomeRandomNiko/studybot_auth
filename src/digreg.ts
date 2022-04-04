import axios from "axios";
import config from "./config";
const axiosInstance = axios.create({
    baseURL: `https://tfobz.digitalesregister.it/v2/api/v1`,
    headers: {
        "API-CLIENT-ID": config.digregClientId,
    }
});

export async function getDigregOAuthTokens(code: string) {
    return new Promise<DigregApi.Token>((resolve, reject) => {
        axiosInstance.post("/token", { code }, { headers: { "API-SECRET": config.digregClientSecret } }).then(response => resolve(response.data)).catch(reject);
    })
}

export namespace DigregApi {

    export type Token = {
        user_id: number,
        token: string,
        expiration: string,
        refresh_token: string,
    }

    export type RefreshToken = {
        token: string,
        expiration: string,
    }

    export type User = {
        id: number,
        firstName: string,
        lastName: string,
        picture: string,
        role: string,
        studentData: {
            id: number,
            name: string,
            firstName: string,
            lastName: string,
            mainClass: {
                id: number,
                name: string,
            },
            isLegalResonsible: boolean
        }
    }

    export type Class = {
        id: number,
        name: string,
        group: boolean,
    }

    export type Subject = {
        id: number,
        name: string,
        belongs_to_class: string,
    }

    export type UpcomingSubstitution = {
        date: string,
        hour: number,
        class: string,
        firstName: string,
        lastName: string,
    }

    export type Lessons = {
        [date: string]: {
            [hour: string]: null | {
                id: number,
                date: string,
                hour: number,
                timeStartObject: {
                    h: number,
                    m: number,
                    ts: number,
                    text: string,
                    html: string
                },
                timeEndObject: {
                    h: number,
                    m: number,
                    ts: number,
                    text: string,
                    html: string
                },
                classId: number,
                className: string,
                description: string,
                teachers: [{ id: number, firstName: string, lastName: string }],
                subject: { id: number, name: string },
                homeworkExams: [{
                    id: number,
                    name: string,
                    homework: number,
                    online: number,
                    deadline: string,
                    hasGradeGroupSubmissions: boolean,
                    typeName: string,
                    gradeGroupSubmissions: [{/*TODO*/ }]
                }],
                lessonContents: [{
                    id: number,
                    name: string,
                    homework: number,
                    online: number,
                    deadline: number,
                    hasLessonContentSubmissions: boolean,
                    typeId: number,
                    typeName: string,
                    lessonContentSubmissions: [{/*TODO*/ }],
                }],
                linkToPreviousHour: number,
                grades: [{
                    grade: string,
                    weight: number,
                    date: string,
                    type: string,
                    typeId: number,
                    studentId: number,
                    cancelled: number,
                    subjectId: number,
                    semester: number,
                    createdTimeStamp: string,
                    cancelledTimeStamp: string | null,
                    description: string
                }],
                observations: [{/*TODO*/ }],
            }
        }
    }

    export type Calendar = Lessons;

    export type Grades = {
        subjects: [{
            subject: {
                id: number,
                name: string,
            },
            absences: number,
            grades: [{
                grade: string,
                weight: number,
                date: string,
                type: string,
                typeId: number,
                studentId: number,
                cancelled: number,
                subjectId: number,
                semester: number,
                createdTimeStamp: string,
                cancelledTimeStamp: string | null,
                description: string
            }],
            subjectId: number,
            student: {
                id: number,
                firstName: string,
                lastName: string,
            },
        }]
    }
}