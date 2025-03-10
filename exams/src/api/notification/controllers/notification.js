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

  async findMyNotifications(ctx) {
    const userId = ctx.state.user.id;
    let apiContentType = "";

    if (ctx.state.user.role.type == "student") {
      apiContentType = "api::student.student";
    } else if (ctx.state.user.role.type == "tutor") {
      apiContentType = "api::tutor.tutor";
    }

    //@ts-ignore
    const entries = await strapi.entityService.findMany(apiContentType, {
      filters: {
        user: { id: userId },
      },
      fields: ["id"], // Retrieve only the exam IDs
    });

    console.log(`notification error `, entries);
    // @ts-ignore
    if (entries[0].id == undefined || entries[0] == null) return;

    // @ts-ignore
    let entriesId = entries[0].id;

    let filter = {
      student: { id: entriesId },
    };

    if (ctx.state.user.role.type == "tutor") {
      //@ts-ignore
      filter = {
        tutor: { id: entriesId },
      };
    }

    // First, find all exams where the student is linked
    const exams = await strapi.entityService.findMany("api::exam.exam", {
      filters: filter,
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

    let idType = "student_id";
    if (ctx.state.user.role.type == "tutor") {
      idType = "tutor_id";
    }

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
          notification.oldInformation.includes(idType)
        ) {
          let str = notification.oldInformation;
          let idPos = str.indexOf(idType);
          let start = str.indexOf('"', idPos);
          let stop = str.indexOf('"', start + 1);

          let nums = str.substring(start, stop);

          if (
            Number(nums[2]) == entriesId &&
            notification.type == "discardChange"
          ) {
            nuNotifs.push(notification);
          }
        }
      });

      nuNotifs.forEach((notification) => {
        if (!notifications.includes(notification)) {
          notifications.push(notification);
        }
      });
    }

    return notifications;
  },
}));
