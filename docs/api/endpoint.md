# get /routines
Authenthicated route used to fetch all user asssociated routines

Sample return(truncated):
``` javascript
    [
        {
            "routine_id": "99",
            "date": "2025-09-18T19:12:16.193Z",
            "exercises": [
                {
                    "exercise_id": 47,
                    "sets": [
                        {
                            "order_no": 0,
                            "reps": 12,
                            "weight": null,
                            "completed": null
                        },
                        {
                            "order_no": 1,
                            "reps": 12,
                            "weight": null,
                            "completed": null
                        },
                        {
                            "order_no": 2,
                            "reps": 12,
                            "weight": null,
                            "completed": null
                        }
                    ]
                },
                {
                    "exercise_id": 559,
                    "sets": [
                        {
                            "order_no": 0,
                            "reps": 10,
                            "weight": null,
                            "completed": null
                        },
                        {
                            "order_no": 1,
                            "reps": 10,
                            "weight": null,
                            "completed": null
                        },
                        {
                            "order_no": 2,
                            "reps": 10,
                            "weight": null,
                            "completed": null
                        }
                    ]
                },
                {
                    "exercise_id": 612,
                    "sets": [
                        {
                            "order_no": 0,
                            "reps": 2,
                            "weight": 881,
                            "completed": true
                        }
                    ]
                }
            ]
        },
        {
            "routine_id": "71",
            "date": "2025-06-11T11:50:11.766Z",
            "exercises": [
                {
                    "exercise_id": 161,
                    "sets": [
                        {
                            "order_no": 0,
                            "reps": 10,
                            "weight": null,
                            "completed": null
                        },
                        {
                            "order_no": 1,
                            "reps": 10,
                            "weight": null,
                            "completed": null
                        },
                        {
                            "order_no": 2,
                            "reps": 10,
                            "weight": null,
                            "completed": null
                        }
                    ]
                },
                {
                    "exercise_id": 265,
                    "sets": [
                        {
                            "order_no": 0,
                            "reps": 10,
                            "weight": null,
                            "completed": null
                        },
                        {
                            "order_no": 1,
                            "reps": 10,
                            "weight": null,
                            "completed": null
                        },
                        {
                            "order_no": 2,
                            "reps": 10,
                            "weight": null,
                            "completed": null
                        }
                    ]
                },
                {
                    "exercise_id": 651,
                    "sets": [
                        {
                            "order_no": 0,
                            "reps": 10,
                            "weight": null,
                            "completed": null
                        },
                        {
                            "order_no": 1,
                            "reps": 10,
                            "weight": null,
                            "completed": null
                        },
                        {
                            "order_no": 2,
                            "reps": 10,
                            "weight": null,
                            "completed": null
                        }
                    ]
                }
            ]
        }, ...

    ]
```

# post /routine
Route intended for updating and creating routines

## Expected Request Body Example
*** Requires at least one exercise in exercises or else the routine gets deleted.

{
            "routine_id": "99",
            "date": "2025-09-18T19:12:16.193Z",
            "exercises": [
                {
                    "exercise_id": 47,
                    "sets": [
                        {
                            "order_no": 0,
                            "reps": 12,
                            "weight": null,
                            "completed": null
                        },
                        {
                            "order_no": 1,
                            "reps": 12,
                            "weight": null,
                            "completed": null
                        },
                        {
                            "order_no": 2,
                            "reps": 12,
                            "weight": null,
                            "completed": null
                        }
                    ]
                },
                {
                    "exercise_id": 559,
                    "sets": [
                        {
                            "order_no": 0,
                            "reps": 10,
                            "weight": null,
                            "completed": null
                        },
                        {
                            "order_no": 1,
                            "reps": 10,
                            "weight": null,
                            "completed": null
                        },
                        {
                            "order_no": 2,
                            "reps": 10,
                            "weight": null,
                            "completed": null
                        }
                    ]
                },
                {
                    "exercise_id": 612,
                    "sets": [
                        {
                            "order_no": 0,
                            "reps": 2,
                            "weight": 881,
                            "completed": true
                        }
                    ]
                }
            ]
        }