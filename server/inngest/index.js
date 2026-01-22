import { Inngest } from "inngest";
import User from "../models/User.js";
import Connection from "../models/Connections.js";
import sendEmail from "../configs/nodeMailer.js";
import Story from "../models/Story.js";
import Message from "../models/Message.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "TasNet-app" });

// Inngest function to save user data to database
const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },
    async ({ event, step }) => {
        const {id,first_name, last_name, email_addresses, image_url} = event.data
        let username = email_addresses[0].email_address.split('@')[0]
        
        //check avalilabilty of username
        const user = await User.findOne({username})

        if(user) {
            username = username + Math.floor(Math.random()*10000)
        }

        const userData= {
            _id: id,
            email: email_addresses[0].email_address,
            full_name: first_name + " " + last_name,
            profile_picture: image_url,
            username: username,
        }

        await User.create(userData)
    },
);

// inngest function to update userdata in database
const syncUserUpdation = inngest.createFunction(
    { id: "update-user-from-clerk" },
    { event: "clerk/user.updated" },
    async ({event}) => {
        const {id,first_name, last_name, email_addresses, image_url} = event.data
        
        const updateUserData = {
            email: email_addresses[0].email_address,
            full_name: first_name + " " + last_name,
            profile_picture: image_url,
        }

        await User.findByIdAndUpdate(id,updateUserData)
    },
);

// inngest function to delete userdata in database
const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-with-clerk" },
    { event: "clerk/user.deleted" },
    async ({event}) => {
        const {id} = event.data

        await User.findByIdAndDelete(id)
    },
);

//inngest function to send reminder when a new connection request is added
const sendNewConnectionRequestReminder= inngest.createFunction(
    {id: "send-new-connection-request-reminder"},
    {event: "app/connection-request"},
    async({event,step})=>{
        const {connectionId} = event.data

        await step.run('send-connection-request-mail', async ()=>{
            const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id')
            const subject = `👋🏼 New Connection Request`
            const body = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Hi ${connection.to_user_id.full_name},</h2>
                <p>You have a new connection request from ${connection.from_user_id.
                full_name} - @${connection.from_user_id.username}</p>
                <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color:
                #10b981;">here</a> to accept or reject the request</p>
                <br/>
                <p>Thanks, <br/>TasNet - Stay Connected</p>
            </div>`

            await sendEmail({
                to: connection.to_user_id.email,
                subject,
                body
            })
        })

        const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000)
        await step.sleepUntil("wait-for-24-hours", in24Hours)
        await step.run('send-connection-request-reminder', async ()=>{
            const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id')
            
            if(connection.status === "accepted"){
                return {message: "Already accepted"}
            }
            
            const subject = `👋🏼 New Connection Request`
            const body = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Hi ${connection.to_user_id.full_name},</h2>
            <p>You have a new connection request from ${connection.from_user_id.
                full_name} - @${connection.from_user_id.username}</p>
                <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color:
                #10b981;">here</a> to accept or reject the request</p>
                <br/>
                <p>Thanks, <br/>TasNet - Stay Connected</p>
                </div>`
                
                await sendEmail({
                    to: connection.to_user_id.email,
                    subject,
                    body
                })
                
                return {message: "Reminder sent."}
        })
        
    }
)

//delete story after 24 hours
const deleteStory = inngest.createFunction(
    {id:'story-delete'},
    {event:'app/story.delete'},
    async ({event,step}) => {
        const {storyId} = event.data
        const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000)
        await step.sleepUntil("wait-for-24-hours", in24Hours)
        await step.run('delete-story', async ()=>{
            await Story.findByIdAndDelete(storyId)
            return {message:"story deleted"}
        })
    }
)

//
const sendNotificationOfUnseenMessages = inngest.createFunction(
    { id: "send-unseen-messages-notification" },
    { cron: "0 9 * * *" }, // every day at 9 am
    async ({ step }) => {
        // 1. Fetch messages and populated users in one go
        const messages = await step.run("fetch-unseen-messages", async () => {
            return await Message.find({ seen: false }).populate('to_user_id');
        });

        // 2. Group messages by user and store user data
        const userNotifications = {};
        messages.forEach(message => {
            const user = message.to_user_id;
            if (user && user._id) {
                if (!userNotifications[user._id]) {
                    userNotifications[user._id] = {
                        email: user.email,
                        full_name: user.full_name,
                        count: 0
                    };
                }
                userNotifications[user._id].count++;
            }
        });

        // 3. Send emails efficiently
        for (const userId in userNotifications) {
            const { email, full_name, count } = userNotifications[userId];

            // Wrap each email in a step so Inngest tracks it
            await step.run(`send-email-${userId}`, async () => {
                const subject = `You have ${count} unseen messages`;
                const body = `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2>Hi ${full_name},</h2>
                        <p>You have ${count} unseen messages</p>
                        <p>Click <a href="${process.env.FRONTEND_URL}/messages" style="color: #10b981;">here</a> to view them</p>
                        <br/>
                        <p>Thanks, <br/>PingUp - Stay Connected</p>
                    </div>`;

                await sendEmail({ to: email, subject, body });
            });
        }

        return { message: `${Object.keys(userNotifications).length} users notified` };
    }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    sendNewConnectionRequestReminder,
    deleteStory,
    sendNotificationOfUnseenMessages,
];