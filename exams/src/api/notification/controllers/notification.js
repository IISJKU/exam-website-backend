"use strict";

/**
 * notification controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::notification.notification", () => ({
  async find(ctx) {
    // Get all notifications using entity service
    const notifications = await strapi.entityService.findMany(
      "api::notification.notification",
      {
        populate: "*", // Adjust fields if necessary
      }
    );

    // Map each notification to the desired structure
    const formattedNotifications = notifications.map((notification) => ({
      accepted: notification.accepted || null,
      createdAt: notification.createdAt,
      createdBy: notification.createdBy || null,
      exam_id: notification.exam_id,
      id: notification.id,
      information: notification.information,
      oldInformation: notification.oldInformation || "",
      seenBy: notification.seenBy,
      sentBy: notification.sentBy,
      type: notification.type,
      updatedAt: notification.updatedAt,
      updatedBy: notification.updatedBy || null,
    }));

    return formattedNotifications;
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    // Get a single notification by ID
    const notification = await strapi.entityService.findOne(
      "api::notification.notification",
      id,
      {
        populate: "*", // Adjust fields if necessary
      }
    );

    if (!notification) {
      return ctx.notFound("Notification not found");
    }

    // Format the response to match the desired structure
    const formattedNotification = {
      accepted: notification.accepted || null,
      createdAt: notification.createdAt,
      createdBy: notification.createdBy || null,
      exam_id: notification.exam_id,
      id: notification.id,
      information: notification.information,
      oldInformation: notification.oldInformation || "",
      seenBy: notification.seenBy,
      sentBy: notification.sentBy,
      type: notification.type,
      updatedAt: notification.updatedAt,
      updatedBy: notification.updatedBy || null,
    };

    return formattedNotification;
  },

  async findNotificationsForStudent(ctx) {
    const userId = ctx.state.user.id;

    const students = await strapi.entityService.findMany(
      "api::student.student",
      {
        filters: {
          user: { id: userId },
        },
        fields: ["id"], // Retrieve only the exam IDs
      }
    );

    // @ts-ignore
    let studentId = students[0].id;

    // First, find all exams where the student is linked
    const exams = await strapi.entityService.findMany("api::exam.exam", {
      filters: {
        student: { id: studentId },
      },
      fields: ["id"], // Retrieve only the exam IDs
    });

    // Extract exam IDs from the result
    // @ts-ignore
    const examIds = exams.map((exam) => exam.id); // Correctly map exam IDs

    // Then, fetch notifications that reference these exam IDs
    let notifications = await strapi.entityService.findMany(
      "api::notification.notification",
      {
        filters: {
          exam_id: { $in: examIds }, // Filter notifications by exam IDs
        },
        populate: "*", //populate with any
      }
    );

    //addDiscardedExamNotifications(studentId);

    {
      const notifications2 = await strapi.entityService.findMany(
        "api::notification.notification",
        {
          populate: "*", // Adjust fields if necessary
        }
      );

      let nuNotifs = [];

      notifications2.forEach((notification) => {
        if (
          notification.oldInformation != undefined &&
          notification.oldInformation.includes("student_id")
        ) {
          let str = notification.oldInformation;
          let idPos = str.indexOf("student_id");
          let start = str.indexOf('"', idPos);
          let stop = str.indexOf('"', start + 1);

          let nums = str.substring(start, stop);
          console.log(nums[2]);
          if (
            Number(nums[2]) == studentId &&
            notification.type == "discardChange"
          ) {
            nuNotifs.push(notification);
          }
        }
      });

      nuNotifs.forEach((notification) => {
        if (!notifications.includes(notification)) {
          notifications.push(notification);
          console.log(notification);
        }
      });
    }

    return notifications;
  },
}));
